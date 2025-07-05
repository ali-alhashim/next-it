'use client'; // This component needs to be a Client Component to use hooks like usePathname

import * as React from 'react';
import './globals.css'; // Make sure your global styles are still imported
import { usePathname } from 'next/navigation'; // Import usePathname

import {
  AppItem,
  Hamburger,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSectionHeader,
  FluentProvider,
  webLightTheme,
  Tooltip,
  createPresenceComponent,
  makeStyles,
  motionTokens,
  tokens,
  useRestoreFocusTarget,
  PresenceComponentProps,
} from '@fluentui/react-components';

import {
  Board20Filled,
  Board20Regular,
  MegaphoneLoud20Filled,
  MegaphoneLoud20Regular,
  PersonLightbulb20Filled,
  PersonLightbulb20Regular,
  PersonSearch20Filled,
  PersonSearch20Regular,
  PreviewLink20Filled,
  PreviewLink20Regular,
  NotePin20Filled,
  NotePin20Regular,
  People20Filled,
  People20Regular,
  HeartPulse20Filled,
  HeartPulse20Regular,
  BoxMultiple20Filled,
  BoxMultiple20Regular,
  PeopleStar20Filled,
  PeopleStar20Regular,
  DataArea20Filled,
  DataArea20Regular,
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  PersonCircle32Regular,
  Person20Filled,
  Person20Regular,
  bundleIcon,
  TicketDiagonalRegular,
  PhoneLaptopRegular,
  DocumentSignatureRegular,
  PersonBoardRegular,
} from '@fluentui/react-icons';

// Constants (unchanged)
const drawerWidth = '260px';
const drawerMargin = tokens.spacingVerticalM;

// Styles (unchanged)
const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
    height: '100vh',
    display: 'flex',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  nav: {
    minWidth: '200px',
    width: drawerWidth,
  },
  content: {
    flex: '1',
    padding: '16px',
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 0,
    gap: tokens.spacingVerticalM,
    gridAutoRows: 'max-content',
    boxSizing: 'border-box',
    position: 'absolute',
    inset: 0,
  },
});

// Animations (unchanged)
const DrawerMotion = createPresenceComponent(() => {
  const keyframes = [
    {
      opacity: 0,
      transform: 'translate3D(-100%, 0, 0)',
      margin: 0,
      backgroundColor: tokens.colorNeutralBackground1,
      borderColor: tokens.colorNeutralBackground1,
      borderRadius: 0,
    },
    {
      opacity: 1,
      transform: 'translate3D(0, 0, 0)',
      margin: drawerMargin,
      borderColor: tokens.colorNeutralBackground4,
      borderRadius: tokens.borderRadiusXLarge,
    },
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationNormal,
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationSlow,
      easing: motionTokens.curveAccelerateMin,
    },
  };
});

const ContentMotion = createPresenceComponent(() => {
  const keyframes = [
    {
      transform: 'translate3D(0, 0, 0)',
      width: '100%',
      margin: 0,
      backgroundColor: tokens.colorNeutralBackground1,
      borderColor: tokens.colorNeutralBackground1,
      borderRadius: 0,
    },
    {
      transform: `translate3D(calc(${drawerWidth} + ${drawerMargin}), 0, 0)`,
      width: `calc(100% - ${drawerWidth} - ${drawerMargin} * 3)`,
      margin: drawerMargin,
      backgroundColor: tokens.colorNeutralBackground3,
      borderColor: tokens.colorNeutralBackground4,
      borderRadius: tokens.borderRadiusXLarge,
    },
  ];

  return {
    enter: {
      keyframes,
      duration: motionTokens.durationGentle,
      easing: motionTokens.curveDecelerateMin,
    },
    exit: {
      keyframes: [...keyframes].reverse(),
      duration: motionTokens.durationGentle,
      easing: motionTokens.curveAccelerateMin,
    },
  };
});

// Icons (unchanged)
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
const Spotlight = bundleIcon(PersonLightbulb20Filled, PersonLightbulb20Regular);
const Search = bundleIcon(PersonSearch20Filled, PersonSearch20Regular);
const Reviews = bundleIcon(PreviewLink20Filled, PreviewLink20Regular);
const Jobs = bundleIcon(NotePin20Filled, NotePin20Regular);
const Interviews = bundleIcon(People20Filled, People20Regular);
const Health = bundleIcon(HeartPulse20Filled, HeartPulse20Regular);
const Training = bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular);
const Career = bundleIcon(PeopleStar20Filled, PeopleStar20Regular);
const Analytics = bundleIcon(DataArea20Filled, DataArea20Regular);
const Reports = bundleIcon(DocumentBulletListMultiple20Filled, DocumentBulletListMultiple20Regular);
const Person = bundleIcon(Person20Filled, Person20Regular);

// Main Layout Component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  const [isOpen, setIsOpen] = React.useState(true);
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const pathname = usePathname(); // Get the current path

  // Define a mapping from pathnames to NavItem values
  // Make sure these paths exactly match your `href` values or are prefixes
  const pathValueMap: { [key: string]: string } = {
    '/': '1', // For the root dashboard
    '/main': '1', // For /main dashboard
    '/dashboard': '1', // For /dashboard
    '/main/announcements': '2',
    '/main/users': '10',
    // Add other mappings as needed
    // Example for exact matches:
    // '/main/tickets': '4',
    // '/main/devices': '5',
    // '/main/assets': '9',
    // '/main/training': '15',
    // '/main/analytics': '19',
    // '/main/reports': '20',
  };

  // Determine the currently selected value based on the pathname
  // This logic finds the longest matching prefix to handle nested routes more accurately
  let currentSelectedValue = '1'; // Default to dashboard
  let longestMatch = '';

  for (const path in pathValueMap) {
    if (pathname.startsWith(path) && path.length > longestMatch.length) {
      currentSelectedValue = pathValueMap[path];
      longestMatch = path;
    }
  }


  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <FluentProvider theme={webLightTheme}>
          <div className={styles.root}>
            <NavDrawer
              // Remove defaultSelectedValue and use selectedValue instead
              selectedValue={currentSelectedValue}
              defaultSelectedCategoryValue="" // Keep if you use categories
              open={isOpen}
              type="inline"
              multiple={true} // Set to false if you want only one item selected at a time
              onOpenChange={(_: any, data: { open: boolean | ((prevState: boolean) => boolean); }) => setIsOpen(data.open)}
              surfaceMotion={{ children: (_: any, props: React.JSX.IntrinsicAttributes & PresenceComponentProps) => <DrawerMotion {...props} /> }}
              className={styles.nav}
            >
              <NavDrawerBody>
                <AppItem icon={<PersonCircle32Regular />} as="a" href="#">
                  Next IT
                </AppItem>

                <NavItem href="/main" icon={<Dashboard />} value="1">
                  Dashboard
                </NavItem>

                <NavItem href="/main/announcements" icon={<Announcements />} value="2">
                  Announcements
                </NavItem>

                {/* NOTE: For items with href="#" you might need custom click handlers
                   or different logic if they are meant to navigate.
                   For now, they won't automatically select based on URL. */}
                <NavItem href="#" icon={<TicketDiagonalRegular />} value="4">
                  Tickets
                </NavItem>

                <NavItem href="#" icon={<PhoneLaptopRegular />} value="5">
                  Devices
                </NavItem>

                <NavItem href="#" icon={<DocumentSignatureRegular />} value="9">
                  Assets
                </NavItem>

                 <NavItem href="/main/users" icon={<PersonBoardRegular />} value="10">
                  Users
                </NavItem>

                <NavSectionHeader>Learning</NavSectionHeader>
                <NavItem href="#" icon={<Training />} value="15">
                  Training
                </NavItem>

                <NavDivider />
                <NavItem href="#" icon={<Analytics />} value="19">
                  Analytics
                </NavItem>
                <NavItem href="#" icon={<Reports />} value="20">
                  Reports
                </NavItem>
              </NavDrawerBody>
            </NavDrawer>

            <ContentMotion visible={isOpen}>
              <div className={styles.content}>
                <Tooltip content="Toggle navigation pane" relationship="label">
                  <Hamburger
                    onClick={() => setIsOpen(!isOpen)}
                    {...restoreFocusTargetAttributes}
                    aria-expanded={isOpen}
                  />
                </Tooltip>

                {/* Your actual page content */}
                <div style={{ width: '100%' }}>{children}</div>
              </div>
            </ContentMotion>
          </div>
        </FluentProvider>
      </body>
    </html>
  );
}