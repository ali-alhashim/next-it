# NextIT Application

This is a Next.js project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), designed to manage IT-related functionalities.

---

## Key Technologies Used

* **Framework:** [Next.js](https://nextjs.org) (App Router)
* **UI Library:** [Fluent UI React Components](https://react.fluentui.dev/) for a consistent and modern user interface.
* **Database:** [MongoDB](https://www.mongodb.com/) (local setup by default, configurable for cloud deployment).

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

* Node.js (LTS recommended)
* npm, Yarn, pnpm, or Bun (choose one)
* MongoDB Community Server (running locally, or access to a MongoDB Atlas cluster)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ali-alhashim/next-it
    cd next-it 
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

npm install @fluentui/react-components --legacy-peer-deps
npm install @fluentui/react --legacy-peer-deps
npm install @fluentui/react-theme-provider --legacy-peer-deps
npm install mongodb --legacy-peer-deps
npm install bcryptjs --legacy-peer-deps

### Database Setup

1.  **Local MongoDB:**
    Ensure your local MongoDB server is running. The default connection URI in `src/lib/mongodb.ts` points to a local instance.

2.  **Cloud MongoDB (Optional):**
    To connect to a cloud-hosted MongoDB (e.g., MongoDB Atlas), update the `uri` environment variable.

   
    uri=your_mongodb_atlas_connection_string_here
    ```
    

### Running the Development Server

1.  **Start the server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

2.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Default Credentials

For initial testing and setup, you can use the following administrator credentials:

* **Admin Badge ID:** `0000`
* **Admin Password:** `admin`

---

## .env.local
NEXTAUTH_SECRET=your_generated_secret_here
MONGODB_URI=mongodb://localhost:27017
NEXTAUTH_URL=http://localhost:3000

## Project Structure

A brief overview of key directories and files:

* `src/app/`: Next.js App Router root, containing pages, layouts, and API routes.
    * `(main)/`: Route group for main application pages (e.g., dashboard, users).
    * `login/`: Dedicated route segment for the login page and its specific layout.
    * `layout.tsx`: Root layout for the application (or specific route group layouts).
    * `page.tsx`: Route segments' entry points.
* `src/lib/mongodb.ts`: MongoDB connection configuration.
* `src/components/`: Reusable React components.
* `public/`: Static assets (images, fonts, etc.).

---

## Contributing



We welcome contributions! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## License



This project is licensed under the MIT License - see the https://opensource.org/license/mit file for details.

---

## Contact

If you have any questions or feedback, please open an issue in this repository.