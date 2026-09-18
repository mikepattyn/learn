import type { Lesson } from "./types";

export const emailLesson: Lesson = {
  id: "email",
  number: 2,
  title: "Send mail with Mikepattyn.Email",
  summary: "Two template files, one factory, SMTP through Zoho. Password in env or Secrets Manager — never in git.",
  minutes: 12,
  repo: "mikepattyn/Mikepattyn.Email",
  repoUrl: "https://github.com/mikepattyn/Mikepattyn.Email",
  steps: [
    {
      id: "what",
      title: "What the library actually does",
      why: "It is not SES and it is not a framework. It is a small sender with file templates.",
      minutes: 1,
      blocks: [
        {
          type: "p",
          text: "Mikepattyn.Email is a .NET 10 library. It reads a subject file and an HTML file, fills {{placeholders}}, and sends through MailKit over SMTP.",
        },
        {
          type: "flow",
          nodes: [
            { label: "Template files", hint: "subject + html" },
            { label: "EmailSender", hint: "render" },
            { label: "MailKit", hint: "SMTP" },
            { label: "Zoho", hint: "smtppro.zoho.eu" },
          ],
        },
        {
          type: "p",
          text: "The SMTP password can come from an environment variable or from AWS Secrets Manager. That is the only AWS hook in this package.",
        },
        {
          type: "link",
          label: "Open Mikepattyn.Email",
          href: "https://github.com/mikepattyn/Mikepattyn.Email",
        },
      ],
    },
    {
      id: "sibling",
      title: "Sit Email next to Contact.Api",
      why: "The Lambda project-references a sibling path. A nested clone will not build.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "On the umbrella these are gitlinks under packages/. On a standalone machine they are two checkouts side by side. Contact.Api looks for ../Mikepattyn.Email.",
        },
        {
          type: "code",
          lang: "text",
          file: "sibling layout",
          content: `~/src/
  Mikepattyn.Email/
    Mikepattyn.Email/Mikepattyn.Email.csproj
  Mikepattyn.Contact.Api/
    Mikepattyn.Contact.Api/Mikepattyn.Contact.Api.csproj`,
        },
        {
          type: "code",
          lang: "xml",
          file: "Mikepattyn.Contact.Api.csproj",
          content: `<ProjectReference Include="..\\..\\Mikepattyn.Email\\Mikepattyn.Email\\Mikepattyn.Email.csproj" />`,
        },
        {
          type: "note",
          text: "Inside the umbrella the same projects live at packages/Mikepattyn.Email/... and packages/Mikepattyn.Contact.Api/.... Do not nest the Contact.Api tree inside the Portfolio remote.",
        },
      ],
    },
    {
      id: "templates",
      title: "Two files per template",
      why: "The renderer does not take a raw HTML string. If a file is missing, send fails before SMTP.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Each template id is a pair of files in one directory. Names must match. Placeholders use {{name}} in both the subject and the body.",
        },
        {
          type: "code",
          lang: "text",
          file: "Templates/contact.subject.txt",
          content: "New contact form message via mikepattyn.nl",
        },
        {
          type: "code",
          lang: "html",
          file: "Templates/contact.body.html",
          content: `<h1>New contact form message</h1>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>`,
        },
        {
          type: "p",
          text: "Contact.Api copies Templates/** into the Lambda output. Keep the files next to the function so AppContext.BaseDirectory can see them at runtime.",
        },
      ],
    },
    {
      id: "factory",
      title: "Create the sender from the environment",
      why: "One factory reads config. You do not construct MailKit yourself in the Lambda.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Pass the templates directory. The factory resolves Zoho host, port, user, and password, then returns IEmailSender.",
        },
        {
          type: "code",
          lang: "csharp",
          file: "EmailServiceFactory.cs",
          content: `var sender = EmailServiceFactory.CreateFromEnvironment(templatesDirectory);

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
);`,
        },
        {
          type: "note",
          text: "TemplateId \"contact\" means contact.subject.txt and contact.body.html in that directory. ReplyTo is the visitor — so you can answer the form from your inbox.",
        },
      ],
    },
    {
      id: "env",
      title: "Configure SMTP without putting secrets in git",
      why: "The factory throws if the password is missing. It will not invent one.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Set these on the process — Lambda environment, local shell, or Compose. Never in source, never in the README.",
        },
        {
          type: "kv",
          rows: [
            { key: "ZohoSmtpUser", value: "Required. SMTP username." },
            { key: "ZohoSmtpFromAddress", value: "Required. From address." },
            { key: "ZohoSmtpAppPassword", value: "App password in env. Use this or the ARN, not both." },
            { key: "ZohoSmtpAppPasswordSecretArn", value: "Secrets Manager ARN. Used when the env password is empty." },
            { key: "ZohoSmtpHost", value: "Optional. Default smtppro.zoho.eu." },
            { key: "ZohoSmtpPort", value: "Optional. Default 587." },
            { key: "ZohoSmtpFromName", value: "Optional. Default Mike Pattyn." },
          ],
        },
        {
          type: "caution",
          text: "Provide exactly one of ZohoSmtpAppPassword or ZohoSmtpAppPasswordSecretArn. The resolver reads the env password first; if it is blank it fetches the secret.",
        },
      ],
    },
    {
      id: "secrets",
      title: "Prefer Secrets Manager in AWS",
      why: "Lambda env is fine for local. Production passwords belong in a secret the role can read.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Create a Secrets Manager secret that holds the Zoho app password as a string. Put the secret ARN in ZohoSmtpAppPasswordSecretArn. Leave ZohoSmtpAppPassword unset.",
        },
        {
          type: "code",
          lang: "csharp",
          file: "ZohoConfigurationResolver",
          content: `var directPassword = Environment.GetEnvironmentVariable("ZohoSmtpAppPassword");
var password = !string.IsNullOrWhiteSpace(directPassword)
    ? directPassword
    : ReadSecret("ZohoSmtpAppPasswordSecretArn");`,
        },
        {
          type: "p",
          text: "The reader calls GetSecretValue on that ARN. The Lambda execution role needs secretsmanager:GetSecretValue on that one secret. Nothing else.",
        },
        {
          type: "list",
          items: [
            "Region follows the Lambda (eu-west-1 on this platform).",
            "Do not paste the password into Constants.Deployment.ts.",
            "Local: export the env password. AWS: export the ARN.",
          ],
        },
      ],
    },
    {
      id: "test",
      title: "Prove the library, then stop",
      why: "You do not need a live SMTP round-trip to know the templates and factory compile.",
      minutes: 1,
      blocks: [
        {
          type: "p",
          text: "The Email repo has xUnit tests for the sender and the template renderer. Run them with the .NET 10 SDK.",
        },
        {
          type: "code",
          lang: "bash",
          file: "Mikepattyn.Email",
          content: "dotnet test Mikepattyn.Email.slnx",
        },
        {
          type: "p",
          text: "Green tests mean render + send wiring is sound. The next lesson is the Lambda door in front of this sender: Turnstile, POST /api/contact, then this same SendAsync.",
        },
        {
          type: "link",
          label: "Open the Email tests",
          href: "https://github.com/mikepattyn/Mikepattyn.Email",
        },
      ],
    },
  ],
};
