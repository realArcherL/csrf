# CSRF

Cross Site Request Forgery.

(Notes are heavily inspired from that on PortSwigger, Bug bounty reports, HackerOne and Internet)

## How does it work?

There are three conditions which should be in place for CSRF to work:

1. Relevant action
2. Cookie based session handling (nothing other than cookies validating the user requests)
   - assuming the SameSite Cookies defense are **NOT** in place (SameSite is a browser mechanism that determines when a website's cookies are
     included in a request). Chrome by default enforces so.
3. No unpredictable params

```html
<html>
  <body>
    <!-- sending the request to vulnerable website -->
    <form action="https://vulnerable-website.com/email/change" method="POST">
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## What are some of the defenses against CSRF

CSRF defenses are applied both on the browser level and on the client side. Some of the most common defenses are

1. CSRF tokens (secrets shared by the server on the client side to make sure the requests came from the user)

   - are they tied to the session token?

2. SameSite Cookies (whether or not should a browser send, Chrome used SameSite Cookie `Lax` by default)

3. Referer-based Validation: This is where the referer of the request is checked, but is less secure.

### What is a CSRF token?

These are unpredictable tokens added to each sensitive request or action performed by the user.

#### Issues which arise because of flawed Validation (ref PortSwigger labs: [bypassing token validation](https://portswigger.net/web-security/csrf/bypassing-token-validation))

1. Flaw1: the CSRF token validation is based on the GET/POST method
2. Validation is based on whether or not the token is present
3. CSRF token is not tied to the session token (any CSRF from the global pool, a hacker could login in to their own account and use
   that token to frame a CSRF attack)
4. CSRF token is tied to a non-session token (this occurs because the session management and tokens work on different framework, if somehow attacker can set a cookie on the users browser, they can use their own cookie value and token to cause a CSRF) ex: `/?search=test%0d%0aSet-Cookie:%20csrfKey=YOUR-KEY%3b%20SameSite=None`
5. CSRF Cookie is simply a duplicate in the cookie (this mean no server side, check if you can set the cookie, you can bypass all CSRF defenses)

#### SameSite Cookie issues: [SameSite Cookie problems](https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions)

1. Valid GET based operation or a method override like so `POST /sensitive/operation?_method=GET`
2. Vulnerable sister/domains
3. Token refresh, as seen in the case of SSO

### Referer Header

1. Depends on whether or not the header exists
2. Naive check on the header value

## Security issues in this project

- Issue1: Simple CSRF issue (check issue:1 and PR:1) to read more about it.
  - the `SameSite="Lax" only works for POST forms, if a website is vulnerable to CSRF through GET, it will still work (checked issue2)

## Fixing the security issues

Either we can use [csrf](https://www.npmjs.com/package/csrf?activeTab=versions) or use [csrf-csrf](https://www.npmjs.com/package/csrf-csrf) or use (helmet)[https://www.npmjs.com/package/helmet]

### Using the [csrf](https://www.npmjs.com/package/csrf?activeTab=versions) package

Considerations: Package was published 4 years ago, OSS Scorecard score: 3.7, [![Socket Badge](https://socket.dev/api/badge/npm/package/csrf)](https://socket.dev/npm/package/csrf) [Snyk Package Advisor](https://snyk.io/advisor/npm-package/csrf) 68/100 (couldn't find badge support for Snyk)

## Dev Notes

### Mar 18th

- Sign-up functionality was completed read why 409 was used here: [#42](https://github.com/realArcherL/csrf/blob/main/src/routes/user.js#L44)

### Mar 22nd

- Haven't corrected the logic for the cookie check and user check (bad checks on `req.cookies.username` on api end-points)

### Mar 25th

- Use a better linter, and stick to a coding style

### April 3 (Secure Code Reviews before a PR)

- added a GitHub action to prevent code to merged into main before a secure code review (this should be case dependent and the developer must decide which PR's require a security review)
