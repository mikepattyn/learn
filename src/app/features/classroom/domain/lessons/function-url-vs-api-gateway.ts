import type { Lesson } from "./types";

export const functionUrlVsApiGatewayLesson: Lesson = {
  id: "function-url-vs-api-gateway",
  number: 4,
  title: "Two HTTP doors for Lambda",
  summary: "See when a form keeps API Gateway and when a bot uses a Function URL with AWS_IAM.",
  minutes: 14,
  repo: "aws/aws-cdk",
  repoUrl: "https://github.com/aws/aws-cdk",
  steps: [
    {
      id: "two-doors",
      title: "Two doors",
      why: "Hold both paths before you pick one in CDK.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "A contact form is a browser talking to a website. A Discord bot is a process on one machine talking to AWS as itself. Those are different callers, so they get different HTTP doors.",
        },
        {
          type: "flow",
          nodes: [
            { label: "Form", hint: "browser" },
            { label: "API Gateway", hint: "/api/*" },
            { label: "Contact Lambda", hint: "Turnstile" },
          ],
        },
        {
          type: "flow",
          nodes: [
            { label: "Bot", hint: "instance role" },
            { label: "Function URL", hint: "AWS_IAM" },
            { label: "Retrieval Lambda", hint: "xAI search" },
          ],
        },
        {
          type: "p",
          text: "You do not need to memorize the boxes. Remember the caller. Browser → API Gateway. One IAM role → Function URL.",
        },
        {
          type: "link",
          label: "AWS: pick Function URL or API Gateway",
          href: "https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html",
        },
      ],
    },
    {
      id: "iam-check",
      title: "What AWS_IAM checks",
      why: "The URL is not a password. The signature is.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Function URL auth is AWS_IAM or NONE. AWS_IAM means every request is signed with Signature Version 4. Lambda recalculates the signature and only runs if they match. Unsigned curl fails.",
        },
        {
          type: "list",
          items: [
            "The caller is an IAM role, not a Bearer token you invented.",
            "New Function URLs need lambda:InvokeFunctionUrl and lambda:InvokeFunction.",
            "Same account: identity policy or resource policy can grant those actions.",
          ],
        },
        {
          type: "note",
          text: "NONE plus a public resource policy lets anyone who has the URL invoke the function. Do not use that for retrieval.",
        },
        {
          type: "link",
          label: "AWS: control access to Function URLs",
          href: "https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html",
        },
      ],
    },
    {
      id: "keep-gateway",
      title: "Why the form keeps API Gateway",
      why: "A site API needs doors a Function URL does not grow.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Contact.Api sits behind API Gateway so the storefront can call same-origin /api/contact. CloudFront, a custom hostname, and a request authorizer live on that path. Function URLs do not give you those.",
        },
        {
          type: "list",
          items: [
            "Custom domain next to the SPA.",
            "Authorizer (Turnstile sits in the Lambda; admin uses a request authorizer).",
            "CloudFront /api/* so 403 from IAM Deny does not become index.html.",
          ],
        },
        {
          type: "p",
          text: "AWS recommends API Gateway when you need those production API features. The form is that case.",
        },
        {
          type: "link",
          label: "Open Mikepattyn.Contact.Api",
          href: "https://github.com/mikepattyn/Mikepattyn.Contact.Api",
        },
      ],
    },
    {
      id: "bot-door",
      title: "Why the bot does not",
      why: "One role does not need a website door.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "The bot runs on one EC2 instance. It already has an instance role. There is no visitor browser, no custom domain, and no CloudFront remap. A Function URL with AWS_IAM is the small door. The xAI key stays on the Lambda.",
        },
        {
          type: "list",
          items: [
            "Caller: instance role, SigV4 from instance credentials.",
            "No NAT, no SSH — Session Manager only. That is a different story than the HTTP door.",
            "Do not copy this door onto Contact or Email “for consistency.”",
          ],
        },
        {
          type: "note",
          text: "Function URLs use HTTP API payload 2.0. The method lives on requestContext.http.method, not REST httpMethod.",
        },
        {
          type: "link",
          label: "AWS: invoke Function URLs (payload 2.0)",
          href: "https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html",
        },
      ],
    },
    {
      id: "cdk-grant",
      title: "Read the CDK grant",
      why: "The grant names a role. That is the whole policy.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "In CDK you attach a Function URL and grant the instance role. Grant both invoke actions. Put the resource policy on the function so the compute stack does not import the URL at synth time.",
        },
        {
          type: "code",
          lang: "csharp",
          file: "FunctionUrl.cs",
          content: `var url = function.AddFunctionUrl(new FunctionUrlOptions
{
    AuthType = FunctionUrlAuthType.AWS_IAM
});
function.GrantInvokeUrl(instanceRole);
function.GrantInvoke(instanceRole);`,
        },
        {
          type: "note",
          text: "If you pass a live Role from the compute stack into GrantInvokeUrl, CDK may attach the policy back onto that role and import the function ARN — a cycle. Import the role ARN as immutable, or grant a wildcard on the instance role and Lambda::Permission on the function.",
        },
        {
          type: "link",
          label: "aws-cdk Function.AddFunctionUrl",
          href: "https://docs.aws.amazon.com/cdk/api/v2/dotnet/api/Amazon.CDK.AWS.Lambda.Function.html",
        },
      ],
    },
    {
      id: "the-body",
      title: "The body stays small",
      why: "Collection IDs are not a caller field.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "The bot POSTs a query. Optional topK defaults to 5 and stops at 20. The Lambda adds source.collection_ids from its own secret, then calls xAI documents/search.",
        },
        {
          type: "code",
          lang: "json",
          file: "request.json",
          content: `{ "query": "psilocybin onset", "topK": 5 }`,
        },
        {
          type: "kv",
          rows: [
            { key: "query", value: "Required. What to search." },
            { key: "topK", value: "Optional. Default 5, max 20. Becomes xAI limit." },
            { key: "collection_ids", value: "Not from the caller. Secret on the Lambda." },
            { key: "XAI_API_KEY", value: "Env/secret name only. Never paste a real key." },
          ],
        },
        {
          type: "caution",
          text: "If the caller could pick collection IDs, they could search a collection they should not. Keep those IDs on the function.",
        },
      ],
    },
    {
      id: "park",
      title: "Park. Ticks stay on the device",
      why: "This lesson is a picture, not a deploy.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "You can stop. The classroom remembers the step in this browser. Nothing grades you. Nothing expires.",
        },
        {
          type: "list",
          items: [
            "Form → API Gateway. Bot → Function URL AWS_IAM.",
            "SigV4 from a role, not a homemade Bearer.",
            "Collection IDs stay on the Lambda.",
          ],
        },
        {
          type: "p",
          text: "Next AWS bites can sit on the same umbrella. You do not need a new scaffold to remember these two doors.",
        },
      ],
    },
  ],
};
