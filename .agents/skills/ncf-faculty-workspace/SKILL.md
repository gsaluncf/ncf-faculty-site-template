---
name: ncf-faculty-workspace
description: Edit and publish the assigned NCF faculty website from its GitHub repository.
---

The assigned website is https://ds.ncf.edu/faculty/facultyname/. Changes are published automatically after a push to the connected GitHub branch. Publishing is limited to this address and its pages.

Clone the repository using its URL from the Faculty workspace:

```sh
git clone <repository-url>
cd <repository-directory>
```

Edit Markdown files in pages/ and update faculty-site.json when adding a page. Use version 1 and a pages array. Every page needs path, source, title, and access. The root path is /. Nested page paths use lowercase letters, digits, and hyphens, and end with /, such as /courses/fall/. The source is a Markdown path inside pages/. Keep the root page and use no more than 30 pages.

The home page at / must always use public access. For each subpage, use Published pages and access in the private workspace: choose Public, NCF sign-in or Specified email addresses, then Save access to commit and publish. Set access.mode to public for anyone, ncf for NCF Google sign-in, or emails for an explicit list. Set access.allowedEmails to [] for public or ncf. For emails, use an array such as ["student@ncf.edu"]. The faculty owner retains access. Each page has its own setting, including pages nested below another page.

Save and publish the edits:

```sh
git add faculty-site.json pages
git commit -m "Update faculty website"
git push
```

Check publication status in /faculty/manage and open the published pages. Keep credentials out of repository files. The shared Worker and publishing destination are managed by the service.

To reseed the site, use Reset from template in the Faculty workspace. It restores faculty-site.json, the starter pages, and this skill in the connected repository. Commit and push subsequent local edits through Git.

## Website assistant and Worker apps

Use Website assistant in the private faculty workspace to prepare page, access, or Worker changes. Review its file changes and select Apply and publish to commit them. Add optional workers entries to faculty-site.json: {"name":"calculator","source":"workers/calculator.js","title":"Calculator","access":{"mode":"public","allowedEmails":[]},"network":"none"}. The app address is /faculty/facultyname/apps/calculator/. Use a single JavaScript module exporting default {async fetch(request,env){...}}; up to five apps. Set Content-Type to text/html; charset=utf-8 for HTML or application/json for JSON. Set network to public only for external API access. Add app secret stores values server-side; never paste values into chat or Git. Browser HTML is isolated; use inline JS/CSS and facultyApp.fetch('/api/path', options) for backend calls. Reload after ten minutes to renew its app credential. Limits: 50ms CPU, 10 subrequests, five seconds, 512KiB response. Apps receive APP_NAME, APP_PATH and their own secrets, with no platform bindings.
