# Lesson 4 — Two HTTP doors for Lambda

Source: [aws/aws-cdk](https://github.com/aws/aws-cdk)  
About 14 minutes. 7 steps.

## 1. Two doors

A contact form is a browser talking to a website. A Discord bot is a process on one machine talking to AWS as itself. Those are different callers, so they get different HTTP doors.

Form → API Gateway → Contact Lambda.

Bot → Function URL (`AWS_IAM`) → retrieval Lambda.

You do not need to memorize the boxes. Remember the caller. Browser → API Gateway. One IAM role → Function URL.

[AWS: pick Function URL or API Gateway](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html)

## 2. What AWS_IAM checks

The URL is not a password. The signature is.

Function URL auth is `AWS_IAM` or `NONE`. `AWS_IAM` means every request is signed with Signature Version 4. Lambda recalculates the signature and only runs if they match. Unsigned curl fails.

- The caller is an IAM role, not a Bearer token you invented.
- New Function URLs need `lambda:InvokeFunctionUrl` and `lambda:InvokeFunction`.
- Same account: identity policy or resource policy can grant those actions.

`NONE` plus a public resource policy lets anyone who has the URL invoke the function. Do not use that for retrieval.

[AWS: control access to Function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)

## 3. Why the form keeps API Gateway

A site API needs doors a Function URL does not grow.

Contact.Api sits behind API Gateway so the storefront can call same-origin `/api/contact`. CloudFront, a custom hostname, and a request authorizer live on that path.

- Custom domain next to the SPA.
- Authorizer (Turnstile sits in the Lambda; admin uses a request authorizer).
- CloudFront `/api/*` so 403 from IAM Deny does not become `index.html`.

AWS recommends API Gateway when you need those production API features. The form is that case.

[Mikepattyn.Contact.Api](https://github.com/mikepattyn/Mikepattyn.Contact.Api)

## 4. Why the bot does not

One role does not need a website door.

The bot runs on one EC2 instance. It already has an instance role. There is no visitor browser, no custom domain, and no CloudFront remap. A Function URL with `AWS_IAM` is the small door. The xAI key stays on the Lambda.

- Caller: instance role, SigV4 from instance credentials.
- No NAT, no SSH — Session Manager only. That is a different story than the HTTP door.
- Do not copy this door onto Contact or Email “for consistency.”

Function URLs use HTTP API payload 2.0. The method lives on `requestContext.http.method`, not REST `httpMethod`.

[AWS: invoke Function URLs](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)

## 5. Read the CDK grant

The grant names a role. That is the whole policy.

In CDK you attach a Function URL and grant the instance role. Grant both invoke actions. Put the resource policy on the function so the compute stack does not import the URL at synth time.

```csharp
var url = function.AddFunctionUrl(new FunctionUrlOptions
{
    AuthType = FunctionUrlAuthType.AWS_IAM
});
function.GrantInvokeUrl(instanceRole);
function.GrantInvoke(instanceRole);
```

If you pass a live Role from the compute stack into `GrantInvokeUrl`, CDK may attach the policy back onto that role and import the function ARN — a cycle. Import the role ARN as immutable, or grant a wildcard on the instance role and `Lambda::Permission` on the function.

## 6. The body stays small

Collection IDs are not a caller field.

The bot POSTs a query. Optional `topK` defaults to 5 and stops at 20. The Lambda adds `source.collection_ids` from its own secret, then calls xAI `documents/search`.

```json
{ "query": "psilocybin onset", "topK": 5 }
```

| Name | Note |
|------|------|
| `query` | Required. What to search. |
| `topK` | Optional. Default 5, max 20. Becomes xAI `limit`. |
| `collection_ids` | Not from the caller. Secret on the Lambda. |
| `XAI_API_KEY` | Env/secret name only. Never paste a real key. |

If the caller could pick collection IDs, they could search a collection they should not. Keep those IDs on the function.

## 7. Park. Ticks stay on the device

This lesson is a picture, not a deploy.

You can stop. The classroom remembers the step in this browser. Nothing grades you. Nothing expires.

- Form → API Gateway. Bot → Function URL `AWS_IAM`.
- SigV4 from a role, not a homemade Bearer.
- Collection IDs stay on the Lambda.

Next AWS bites can sit on the same umbrella. You do not need a new scaffold to remember these two doors.
