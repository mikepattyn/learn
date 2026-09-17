# Lesson 3 — Wire Contact.Api on Lambda

Source: [mikepattyn/Mikepattyn.Contact.Api](https://github.com/mikepattyn/Mikepattyn.Contact.Api)  
About 14 minutes. Eight steps.

## 1. The path a message takes

A visitor submits the contact form on mikepattyn.nl. Cloudflare sits in front. The Lambda never talks to the browser’s real IP for Turnstile — CloudFront would lie.

Flow: Form `POST` JSON → API Gateway `/api/contact` → Lambda (Turnstile) → Email (Zoho SMTP).

Contact.Api is the public package gitlink. CDK, API Gateway, and the pointer bump live on the mikepattyn umbrella. This repo is the function, the templates, and the tests.

## 2. The Lambda is a thin door

`Function.cs` does not parse the form. It logs the method and path, then hands off.

The public constructor builds the handler from the environment: templates directory, Email factory, Turnstile secret, delivery address. Tests inject a handler instead.

```csharp
public Task<APIGatewayProxyResponse> FunctionHandler(
    APIGatewayProxyRequest request,
    ILambdaContext context
)
{
    context.Logger.LogInformation(
        $"Contact API: {request.HttpMethod} {request.Path}"
    );
    return _handler.HandleAsync(request);
}
```

Serializer: `Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer`. Target framework: `net10.0`.

## 3. Validate, Turnstile, then send

Order matters. Mail must not leave if the payload or the bot check fails.

- `OPTIONS` → 204, CORS headers. Browser preflight ends here.
- Anything but `POST` → 405.
- JSON needs email, message, `turnstileToken`. Missing → 400.
- `_honey` filled in → 400. Same message. Do not tell bots why.
- Turnstile fails → 403.
- `SendAsync` with template `contact` → 202 `{ message: "Message sent" }`.

```csharp
await _emailSender.SendAsync(
    new EmailSendRequest(
        TemplateId: "contact",
        Data: new Dictionary<string, string>
        {
            ["name"] = payload.Name ?? string.Empty,
            ["email"] = payload.Email,
            ["message"] = payload.Message,
        },
        To: _deliveryAddress,
        ReplyTo: payload.Email
    )
);
```

Verify Turnstile with `remoteIp: null`. Behind CloudFront, `SourceIp` is an edge address. Passing it makes valid tokens fail.

## 4. Turnstile secret, same pattern as SMTP

The Lambda wants exactly one of `TurnstileSecret` or `TurnstileSecretArn`. Delivery address is optional and defaults to `info@mikepattyn.nl`.

| Variable | Notes |
|----------|--------|
| `ContactDeliveryAddress` | Optional. Inbox that receives the form. |
| `TurnstileSecret` | Widget secret in env. Local-friendly. |
| `TurnstileSecretArn` | Secrets Manager. Production-friendly. |
| `ZohoSmtp*` | Same variables as lesson 2. Required to send. |

Cloudflare Turnstile is the captcha. The site widget gives the browser a token. This Lambda asks Cloudflare if that token is real, then drops it.

You still need the Email env (or ARNs) on this same function. Contact.Api does not re-implement SMTP.

## 5. The JSON the form must send

Field names are part of the contract. A renamed key looks like a bad payload, not a mail bug.

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "message": "Hello",
  "turnstileToken": "…",
  "_honey": ""
}
```

Name is optional. Email, message, and `turnstileToken` are required. `_honey` must stay empty — it is a hidden field for bots that fill every input.

- Property names are case-insensitive on deserialize.
- `turnstileToken` is the JSON name, not `TurnstileToken`.
- `_honey` is the JSON name for the honeypot.

## 6. Build and test beside Email

Needs the .NET 10 SDK and the Email checkout next door. From Contact.Api:

```bash
dotnet test Mikepattyn.Contact.Api.slnx
```

The test project drives `ContactRequestHandler` with fakes. That is why `Function` has an internal constructor. You can assert 400 / 403 / 202 without Zoho.

Templates are copied to output with `PreserveNewest`. If tests cannot find `contact.body.html`, the csproj `None Include` is the first place to look.

## 7. CDK stays on the umbrella

This repo has no stacks. Shipping means a pointer bump, not a second CDK app.

The mikepattyn umbrella owns API Gateway, the Lambda construct, IAM for Secrets Manager, and the domain. Contact.Api is linked at `packages/Mikepattyn.Contact.Api`.

- Do not add a CDK project inside this package repo.
- Do not nest this tree inside the Portfolio remote.
- Operators still use SSO / the default credential chain / GitHub OIDC — not access keys in source.
- Region on this platform is `eu-west-1` unless you changed it at scaffold time.

Flow: edit package (this repo) → pointer bump (umbrella) → CDK deploy (umbrella) → live `/api/contact`.

## 8. Ship the function, park the lesson

When the package tests are green, bump the gitlink on the umbrella and deploy from there. Confirm `POST /api/contact` from the real site widget, not from a guessed curl against localhost.

- Scaffold gave you the umbrella shape.
- Email gave you templates + SMTP + optional Secrets Manager.
- Contact.Api gave you the Lambda door with Turnstile.

You can stop. The classroom will remember the step. Next AWS bites — queues, workers, more Lambdas — can sit on this same umbrella without a new scaffold.
