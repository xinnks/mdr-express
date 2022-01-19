const { CollectContentForDay } = require("./collectContentForDay");
const { KeywordsUpdateRequest } = require("./keywordsUpdateRequest");
const { SendContentEmails } = require("./sendContentEmails");
const { Subscribe } = require("./subscribe");
const { Unsubscribe } = require("./unsubscribe");
const { UpdateKeywords } = require("./updateKeywords");
const { UnsubscriptionRequest } = require("./unsubscriptionRequest");

module.exports = {
  CollectContentForDay,
  KeywordsUpdateRequest,
  SendContentEmails,
  Subscribe,
  Unsubscribe,
  UnsubscriptionRequest,
  UpdateKeywords
}