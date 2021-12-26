/**
 * Public configuration for frontend and backend.
 */
export class SharedConfig {
  perPage = 20;
  googlePlusClientId = '';
  githubClientId = '';
  minUserAge = 12;
  maxUserAge = 90;
  minUserName = 2;
  maxUserName = 40;
  emailPattern = /^[^@]{1,255}@[^@]{1,255}\.[^@]{1,255}$/;
  minLengthPassword = 6;
  maxLengthPassword = 20;
  minLengthUrl = 6;
  maxLengthUrl = 200;
  minLengthTag = 3;
  maxLengthTag = 50;
  minLengthBio = 3;
  maxLengthBio = 2000;
  minLengthArticleTitle = 6;
  maxLengthArticleTitle = 100;
  maxItemsTagsPerArticle = 5;
  maxItemsTagsPerPage = 50;
}
