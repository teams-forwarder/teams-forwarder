# Teams Forwarder

This project is a collection of n8n workflows helping MS-Teams users to forward messages to better chat programs.

## Reason

Although MS-Teams is a great tool for IT beginners, it lacks features for professional users and inter-company communication. Missing external tool integrations and no option for multi-tenant users (like agencies) hinder Teams from becoming a suitable tool for all fields. With a great variety about formatting and auto-preview capabilities comes a great insecurity of which part of your copy-paste snippet will become formatting rather than text. This n8n workflow collection is for those who seek an escape to better tools but do want to support MS-Teams-native colleagues with properly formatted Markdown messages.

## How It Works

The n8n trigger node for Incoming MS-Teams messages enables you to forward messages to your favorite chat program. Replies can be sent via the MS-Graph API. Including the original MS-Teams message as a reference closes the loop in the n8n workflow.
Since one of the pain points is formatting, n8n will send a properly formatted image back to the MS-Teams user. This will be generated from your Markdown reply message. A [markdown-2-png converter](./md2png/) is part of this repository.

## Supported Chat Programs

### Mattermost

[Forwarding messages to Mattermost](./mattermost/): responding via slash command.

![incoming message](./mattermost/docs/images/example-1.png "incoming message")
![reply to teams message](./mattermost/docs/images/example-2.png "reply to teams message")
![reply confirmation](./mattermost/docs/images/example-3.png "reply confirmation")
![incoming in teams](./mattermost/docs/images/example-4.png "incoming in teams")
![rendered markdown](./mattermost/docs/images/example-5.png "rendered markdown")

Images are forwarded from the original MS-Teams message.

![incoming message with image](./mattermost/docs/images/example-6.png "incoming message with image")

Tested with n8n 2.37.6 and Mattermost Team Edition 11.10.1.

### Slack

(upcoming)

### Discord

(upcoming)
