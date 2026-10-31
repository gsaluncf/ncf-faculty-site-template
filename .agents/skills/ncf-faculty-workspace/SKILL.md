---
name: ncf-faculty-workspace
description: Edit and publish the assigned NCF faculty website from its GitHub repository.
---

The assigned website is https://ds.ncf.edu/faculty/faculty/. Changes are published automatically after a push to the connected GitHub branch. Publishing is limited to this address and its pages.

Clone the repository using its URL from the Faculty workspace:

```sh
git clone <repository-url>
cd <repository-directory>
```

Edit Markdown files in pages/ and update faculty-site.json when adding a page. Use version 1 and a pages array. Every page needs path, source, title, and access. The root path is /. Nested page paths use lowercase letters, digits, and hyphens, and end with /, such as /courses/fall/. The source is a Markdown path inside pages/. Keep the root page and use no more than 30 pages.

Set access.mode to public for anyone, ncf for NCF Google sign-in, or emails for an explicit list. Set access.allowedEmails to [] for public or ncf. For emails, use an array such as ["student@ncf.edu"]. The faculty owner retains access. Each page has its own setting, including pages nested below another page.

Save and publish the edits:

```sh
git add faculty-site.json pages
git commit -m "Update faculty website"
git push
```

Check publication status in /faculty/manage and open the published pages. Keep credentials out of repository files. The shared Worker and publishing destination are managed by the service.

To reseed the site, use Reset from template in the Faculty workspace. It restores faculty-site.json, the starter pages, and this skill in the connected repository. Commit and push subsequent local edits through Git.
