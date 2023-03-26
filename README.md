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

CSRF defenses are applied both on the browser level and on the client side. Some of the most commond defenses are

1. CSRF tokens (secrets shared by the server on the client side to make sure the requests came from the user)

   - are they tied to the session token?

2. SameSite Cookies (whehter or not should a browser send, Chrome used SameSite Cookie `Lax` by default)

3. Referer-based Validation: This is where the referer of the request is checked, but is less secure.

### What is a CSRF token?

These are unpredictable tokens added to each sensitive request or action performed by the user.

#### Issues which arise because of flawed Validation

1. Flaw1: the CSRF token validation is based on the GET/POST method

## Security issues in this project

- Issue1: Simple CSRF issue (check issue:1 and PR:1) to read more about it.
  - the `SameSite="Lax" only works for POST forms, if a website is vulnerable to CSRF through GET, it will still work (checked issue2)

## Dev Notes

### Mar 18th

- Sign-up functionality was completed read why 409 was used here: [#42](https://github.com/realArcherL/csrf/blob/main/src/routes/user.js#L44)

### Mar 22nd

- Haven't corrected the logic for the cookie check and user check (bad checks on `req.cookies.username` on api end-points)

### Mar 25th

- Use a better linter, and stick to a coding style
