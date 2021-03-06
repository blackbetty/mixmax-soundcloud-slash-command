# SoundCloud Slash Command for Mixmax

This is an open source Mixmax Slash Command.
See <http://sdk.mixmax.com/docs/tutorial-giphy-slash-command> for more information about
how to use this example code in Mixmax.

## Running locally

1. Install using `npm install`
2. Run using `npm start`
3. Add a Mixmax Slash Command in your Mixmax dashboard. (Call it songsearch, or whatever you'd like) Using:<br>
   Typeahead API URL: https://localhost:9145/typeahead<br>
   Resolver API URL: https://localhost:9145/resolver
4. Quit Chrome and restart it using the following command on OS X: `open -a Google\ Chrome --args --ignore-certificate-errors`. See [here](http://developer.mixmax.com/docs/integration-api-appendix#local-development-error-neterr_insecure_response) for why.
5. Compose an email in Gmail using Mixmax and type /songsearch [Search]
(or whatever you called it above)
