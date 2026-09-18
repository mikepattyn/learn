import type { Lesson } from "./types";

export const contactApiLesson: Lesson = {
  id: "contact-api",
  number: 3,
  title: "Wire Contact.Api on Lambda",
  summary: "A thin API Gateway Lambda: validate, Turnstile, send. CDK and deploy stay on the umbrella.",
  minutes: 14,
  repo: "mikepattyn/Mikepattyn.Contact.Api",
  repoUrl: "https://github.com/mikepattyn/Mikepattyn.Contact.Api",
  steps: [
    {
      id: "path",
      title: "The path a message takes",
      why: "Hold this picture. Every file in the repo is one box on it.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "A visitor submits the contact form on mikepattyn.nl. Cloudflare sits in front. The Lambda never talks to the browser’s real IP for Turnstile — CloudFront would lie.",
        },
        {
          type: "flow",
          nodes: [
            { label: "Form", hint: "POST JSON" },
            { label: "API Gateway", hint: "/api/contact" },
            { label: "Lambda", hint: "Turnstile" },
            { label: "Email", hint: "Zoho SMTP" },
          ],
        },
        {
          type: "p",
          text: "Contact.Api is the public package gitlink. CDK, API Gateway, and the pointer bump live on the mikepattyn umbrella. This repo is the function, the templates, and the tests.",
        },
        {
          type: "link",
          label: "Open Mikepattyn.Contact.Api",
          href: "https://github.com/mikepattyn/Mikepattyn.Contact.Api",
        },
      ],
    },
    {
      id: "door",
      title: "The Lambda is a thin door",
      why: "Function.cs does not parse the form. It logs the method and path, then hands off.",
      minutes: 1,
      blocks: [
        {
          type: "p",
          text: "The public constructor builds the handler from the environment: templates directory, Email factory, Turnstile secret, delivery address. Tests inject a handler instead.",
        },
        {
          type: "code",
          lang: "csharp",
          file: "Function.cs",
          content: `public Task<APIGatewayProxyResponse> FunctionHandler(
    APIGatewayProxyRequest request,
    ILambdaContext context
)
{
    context.Logger.LogInformation(
        $"Contact API: {request.HttpMethod} {request.Path}"
    );
    return _handler.HandleAsync(request);
}`,
        },
        {
          type: "note",
          text: "Serializer: Amazon.Lambda.Serialization.SystemTextJson. DefaultLambdaJsonSerializer. Target framework: net10.0.",
        },
      ],
    },
    {
      id: "handler",
      title: "Validate, Turnstile, then send",
      why: "Order matters. Mail must not leave if the payload or the bot check fails.",
      minutes: 2,
      blocks: [
        {
          type: "list",
          items: [
            "OPTIONS → 204, CORS headers. Browser preflight ends here.",
            "Anything but POST → 405.",
            "JSON needs email, message, turnstileToken. Missing → 400.",
            "_honey filled in → 400. Same message. Do not tell bots why.",
            "Turnstile fails → 403.",
            "SendAsync with template contact → 202 { message: \"Message sent\" }.",
          ],
        },
        {
          type: "code",
          lang: "csharp",
          file: "ContactRequestHandler.cs",
          content: `await _emailSender.SendAsync(
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
);`,
        },
        {
          type: "caution",
          text: "Verify Turnstile with remoteIp: null. Behind CloudFront, SourceIp is an edge address. Passing it makes valid tokens fail.",
        },
      ],
    },
    {
      id: "turnstile",
      title: "Turnstile secret, same pattern as SMTP",
      why: "Bot check credentials follow the Email library’s secret rule so ops stays one shape.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "The Lambda wants exactly one of TurnstileSecret or TurnstileSecretArn. Delivery address is optional and defaults to info@mikepattyn.nl.",
        },
        {
          type: "kv",
          rows: [
            { key: "ContactDeliveryAddress", value: "Optional. Inbox that receives the form." },
            { key: "TurnstileSecret", value: "Widget secret in env. Local-friendly." },
            { key: "TurnstileSecretArn", value: "Secrets Manager. Production-friendly." },
            { key: "ZohoSmtp*", value: "Same variables as lesson 2. Required to send." },
          ],
        },
        {
          type: "p",
          text: "Cloudflare Turnstile is the captcha. The site widget gives the browser a token. This Lambda asks Cloudflare if that token is real, then drops it.",
        },
        {
          type: "note",
          text: "You still need the Email env (or ARNs) on this same function. Contact.Api does not re-implement SMTP.",
        },
      ],
    },
    {
      id: "payload",
      title: "The JSON the form must send",
      why: "Field names are part of the contract. A renamed key looks like a bad payload, not a mail bug.",
      minutes: 2,
      blocks: [
        {
          type: "code",
          lang: "json",
          file: "POST /api/contact",
          content: `{
  "name": "Alex",
  "email": "alex@example.com",
  "message": "Hello",
  "turnstileToken": "…",
  "_honey": ""
}`,
        },
        {
          type: "p",
          text: "Name is optional. Email, message, and turnstileToken are required. _honey must stay empty — it is a hidden field for bots that fill every input.",
        },
        {
          type: "list",
          items: [
            "Property names are case-insensitive on deserialize.",
            "turnstileToken is the JSON name, not TurnstileToken.",
            "_honey is the JSON name for the honeypot.",
          ],
        },
      ],
    },
    {
      id: "run",
      title: "Build and test beside Email",
      why: "If the sibling path is wrong, restore fails before any test runs. Fix layout, not the handler.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Needs the .NET 10 SDK and the Email checkout next door. From Contact.Api:",
        },
        {
          type: "code",
          lang: "bash",
          file: "Mikepattyn.Contact.Api",
          content: "dotnet test Mikepattyn.Contact.Api.slnx",
        },
        {
          type: "p",
          text: "The test project drives ContactRequestHandler with fakes. That is why Function has an internal constructor. You can assert 400 / 403 / 202 without Zoho.",
        },
        {
          type: "note",
          text: "Templates are copied to output with PreserveNewest. If tests cannot find contact.body.html, the csproj None Include is the first place to look.",
        },
      ],
    },
    {
      id: "umbrella",
      title: "CDK stays on the umbrella",
      why: "This repo has no stacks. Shipping means a pointer bump, not a second CDK app.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "The mikepattyn umbrella owns API Gateway, the Lambda construct, IAM for Secrets Manager, and the domain. Contact.Api is linked at packages/Mikepattyn.Contact.Api.",
        },
        {
          type: "list",
          items: [
            "Do not add a CDK project inside this package repo.",
            "Do not nest this tree inside the Portfolio remote.",
            "Operators still use SSO / the default credential chain / GitHub OIDC — not access keys in source.",
            "Region on this platform is eu-west-1 unless you changed it at scaffold time.",
          ],
        },
        {
          type: "flow",
          nodes: [
            { label: "Edit package", hint: "this repo" },
            { label: "Pointer bump", hint: "umbrella" },
            { label: "CDK deploy", hint: "umbrella" },
            { label: "Live /api/contact", hint: "Gateway" },
          ],
        },
      ],
    },
    {
      id: "ship",
      title: "Ship the function, park the lesson",
      why: "You now have a form path you can explain in one breath. That is the whole point.",
      minutes: 1,
      blocks: [
        {
          type: "p",
          text: "When the package tests are green, bump the gitlink on the umbrella and deploy from there. Confirm POST /api/contact from the real site widget, not from a guessed curl against localhost.",
        },
        {
          type: "list",
          items: [
            "Scaffold gave you the umbrella shape.",
            "Email gave you templates + SMTP + optional Secrets Manager.",
            "Contact.Api gave you the Lambda door with Turnstile.",
          ],
        },
        {
          type: "p",
          text: "You can stop. The classroom will remember the step. Next AWS bites — queues, workers, more Lambdas — can sit on this same umbrella without a new scaffold.",
        },
      ],
    },
  ],
};
