# Faculty website

After creating this repository, [connect the NCF faculty publishing App](https://github.com/apps/ncf-faculty-sites/installations/new). Select only this repository, then select Install. The faculty service completes setup and publishes automatically.

Edit pages/ and faculty-site.json, commit, and push to publish updates. Each page can be public, require NCF Google sign-in, or permit named email addresses. The included skill explains the workflow.

Website assistant in the private faculty workspace can prepare page, access and Worker app changes. Review the files and select Apply and publish. Use Add app secret for API credentials; keep values out of chat and Git. Optional Worker apps are configured in faculty-site.json and run inside the assigned faculty address.

## Tunnel applications

To publish an app running on a computer, open **Tunnel applications** in the faculty workspace and select **Add tunnel application**. Enter its local address. If you provide a start command, enter the app folder. Choose viewer access and edit the offline page.

Save, choose the computer's operating system, and select **Download setup**. Extract the ZIP and run `Install.cmd` on Windows or `bash install.sh` on macOS/Linux. Use **Check connection** to confirm it is online. The installer includes start and stop scripts and an option to start automatically at sign-in.

After changing the local address or start command, download and run setup again. Offline content can be changed in the workspace without reinstalling.
