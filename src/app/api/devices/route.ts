import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '0');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search')?.trim() || '';
  const sortField = searchParams.get('sortField') || 'serialNumber';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

  try {
    const db = await connectDB();
    const devicesCol = db.collection('devices');
    const searchRegex = search ? new RegExp(search, 'i') : null;

    // total count before pagination
    const totalCountPipeline: any[] = [
      { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { serialNumber: { $regex: searchRegex } },
                  { category: { $regex: searchRegex } },
                  { model: { $regex: searchRegex } },
                  { manufacture: { $regex: searchRegex } },
                  { description: { $regex: searchRegex } },
                  { 'users.badgeNumber': { $regex: searchRegex } },
                ],
              },
            },
          ]
        : []),
      { $group: { _id: '$_id' } },
      { $count: 'count' },
    ];

    const totalAgg = await devicesCol.aggregate(totalCountPipeline).toArray();
    const total = totalAgg[0]?.count || 0;
    const safeSkip = Math.min(page * pageSize, Math.max(total - pageSize, 0));

    // Main aggregation
    const pipeline: any[] = [
      { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { serialNumber: { $regex: searchRegex } },
                  { category: { $regex: searchRegex } },
                  { model: { $regex: searchRegex } },
                  { manufacture: { $regex: searchRegex } },
                  { description: { $regex: searchRegex } },
                  { 'users.badgeNumber': { $regex: searchRegex } },
                ],
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'users',
          localField: 'users.badgeNumber',
          foreignField: 'badgeNumber',
          as: 'userInfo',
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          serialNumber: { $first: '$serialNumber' },
          category: { $first: '$category' },
          model: { $first: '$model' },
          manufacture: { $first: '$manufacture' },
          description: { $first: '$description' },
          status: { $first: '$status' },
          users: {
            $push: {
              badgeNumber: '$users.badgeNumber',
              userName: '$userInfo.name',
              receivedDate: '$users.receivedDate',
              handoverDate: '$users.handoverDate',
              note: '$users.note',
            },
          },
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: safeSkip },
      { $limit: pageSize },
    ];

    const devices = await devicesCol.aggregate(pipeline).toArray();

    const cleanDevices = devices.map((device) => ({
      id: device._id.toString(),
      serialNumber: device.serialNumber,
      category: device.category,
      model: device.model,
      manufacture: device.manufacture,
      description: device.description,
      status: device.status,
      users: device.users,
    }));

    return NextResponse.json({ devices: cleanDevices, total });
  } catch (error) {
    console.error('[API] Failed to fetch devices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
