# TypeScript Example App with SSO powered by WorkOS

An example application demonstrating to use the [WorkOS Node SDK](https://github.com/workos-inc/workos-node) to authenticate users via SSO. 

## Prerequisites

Node.js version 10+

## Node Project Setup

1. Clone the main repo and install dependencies for the app you'd like to use:
    ```bash
    # HTTPS
    git clone https://github.com/workos/typescript-example-applications.git
    ```
    or

    ```bash
    # SSH
    git clone git@github.com:workos/typescript-example-applications.git
    ```

2. Navigate to SSO app within the cloned repo. 
   ```bash
   $ cd typescript-example-applications/typescript-sso-example
   ```

3. Install the dependencies. 
    ```bash
    $ npm install
    ```

## Configure your environment

4. Grab your API Key and Client ID from the WorkOS Dashboard. Create a `.env`
file at the root of the project, and store these like so:
    ```
    WORKOS_API_KEY=sk_xxxxxxxxxxxxx
    WORKOS_CLIENT_ID=project_xxxxxxxxxxxx
    ```

## SSO Setup with WorkOS

5. Follow the [SSO authentication flow instructions](https://workos.com/docs/sso/guide/introduction) to create a new SSO connection in your WorkOS dashboard.

6. Add `http://localhost:8000/callback` as a Redirect URI in the Configuration section of the Dashboard.

7. Update `routes/index.js` with the Organization ID.

## Run the development server

```sh
npm run dev
```

## Compile TypeScript code and run the server

```sh
npm run build
npm start
```

Head to `http://localhost:8000/` to begin the login flow!


## Need help?

If you get stuck and aren't able to resolve the issue by reading our [WorkOS Node SDK documentation](https://docs.workos.com/sdk/node), API reference, or tutorials, you can reach out to us at support@workos.com and we'll lend a hand.