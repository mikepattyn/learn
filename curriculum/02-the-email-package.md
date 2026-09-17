# Lesson 2 — Send mail with Mikepattyn.Email

Source: [mikepattyn/Mikepattyn.Email](https://github.com/mikepattyn/Mikepattyn.Email)  
About 12 minutes. Seven steps.

## 1. What the library actually does

Mikepattyn.Email is a .NET 10 library. It reads a subject file and an HTML file, fills `{{placeholders}}`, and sends through MailKit over SMTP.

Flow: template files → EmailSender → MailKit → Zoho (`smtppro.zoho.eu`).

The SMTP password can come from an environment variable or from AWS Secrets Manager. That is the only AWS hook in this package.

## 2. Sit Email next to Contact.Api

On the umbrella these are gitlinks under `packages/`. On a standalone machine they are two checkouts side by side. Contact.Api looks for `../Mikepattyn.Email`.

```
~/src/
  Mikepattyn.Email/
    Mikepattyn.Email/Mikepattyn.Email.csproj
  Mikepattyn.Contact.Api/
    Mikepattyn.Contact.Api/Mikepattyn.Contact.Api.csproj
```

```xml
<ProjectReference Include="..\..\Mikepattyn.Email\Mikepattyn.Email\Mikepattyn.Email.csproj" />
```

Inside the umbrella the same projects live at `packages/Mikepattyn.Email/...` and `packages/Mikepattyn.Contact.Api/...`. Do not nest the Contact.Api tree inside the Portfolio remote.

## 3. Two files per template

Each template id is a pair of files in one directory. Names must match. Placeholders use `{{name}}` in both the subject and the body.

`Templates/contact.subject.txt`

```
New contact form message via mikepattyn.nl
```

`Templates/contact.body.html`

```html
<h1>New contact form message</h1>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
```

Contact.Api copies `Templates/**` into the Lambda output. Keep the files next to the function so `AppContext.BaseDirectory` can see them at runtime.

## 4. Create the sender from the environment

Pass the templates directory. The factory resolves Zoho host, port, user, and password, then returns `IEmailSender`.

```csharp
var sender = EmailServiceFactory.CreateFromEnvironment(templatesDirectory);

await sender.SendAsync(
    new EmailSendRequest(
        TemplateId: "contact",
        Data: new Dictionary<string, string>
        {
            ["name"] = "Alex",
            ["email"] = "alex@example.com",
            ["message"] = "Hello",
        },
        To: "inbox@example.com",
        ReplyTo: "alex@example.com"
    )
);
```

`TemplateId` `"contact"` means `contact.subject.txt` and `contact.body.html` in that directory. `ReplyTo` is the visitor — so you can answer the form from your inbox.

## 5. Configure SMTP without putting secrets in git

Set these on the process — Lambda environment, local shell, or Compose. Never in source, never in the README.

| Variable | Notes |
|----------|--------|
| `ZohoSmtpUser` | Required. SMTP username. |
| `ZohoSmtpFromAddress` | Required. From address. |
| `ZohoSmtpAppPassword` | App password in env. Use this or the ARN, not both. |
| `ZohoSmtpAppPasswordSecretArn` | Secrets Manager ARN. Used when the env password is empty. |
| `ZohoSmtpHost` | Optional. Default `smtppro.zoho.eu`. |
| `ZohoSmtpPort` | Optional. Default `587`. |
| `ZohoSmtpFromName` | Optional. Default `Mike Pattyn`. |

Provide exactly one of `ZohoSmtpAppPassword` or `ZohoSmtpAppPasswordSecretArn`. The resolver reads the env password first; if it is blank it fetches the secret.

## 6. Prefer Secrets Manager in AWS

Create a Secrets Manager secret that holds the Zoho app password as a string. Put the secret ARN in `ZohoSmtpAppPasswordSecretArn`. Leave `ZohoSmtpAppPassword` unset.

```csharp
var directPassword = Environment.GetEnvironmentVariable("ZohoSmtpAppPassword");
var password = !string.IsNullOrWhiteSpace(directPassword)
    ? directPassword
    : ReadSecret("ZohoSmtpAppPasswordSecretArn");
```

The reader calls `GetSecretValue` on that ARN. The Lambda execution role needs `secretsmanager:GetSecretValue` on that one secret. Nothing else.

- Region follows the Lambda (`eu-west-1` on this platform).
- Do not paste the password into `Constants.Deployment.ts`.
- Local: export the env password. AWS: export the ARN.

## 7. Prove the library, then stop

The Email repo has xUnit tests for the sender and the template renderer. Run them with the .NET 10 SDK.

```bash
dotnet test Mikepattyn.Email.slnx
```

Green tests mean render + send wiring is sound. The next lesson is the Lambda door in front of this sender: Turnstile, `POST /api/contact`, then this same `SendAsync`.
