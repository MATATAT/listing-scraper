~~Scrapes listings from career websites (one in particular right now) and maintains a state of what are new listings, existing listings, and listings that were closed. I started it as a distraction to get over some bad news so don't judge me too much for its existence. WIP but was going to eventually have it run on a Lambda writing the result to S3 to surface the data and send an email when new listings arrive.~~

I ended up "retiring" this code since it wasn't as straightforward as I expected to deploy a Rust application into Lambda. Maybe will come back to this and explore the idea more in the future. There are some helpful links below.

- https://dev.to/nicholaschiasson/beginner-s-guide-to-running-rust-on-aws-lambda-277n
- https://dev.to/aws-builders/misadventures-playing-in-rust-on-aws-lambda-lkj
- https://docs.aws.amazon.com/sdk-for-rust/latest/dg/getting-started.html
