## Postman tests

To run [postman tests](https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json),
you need to go through the three steps described in [root README.md](../../../README.md) and start the web server.

After that execute:

```bash
yarn test-postman
```

Ro rerun the tests, first you need clear MySQL tables:

```sql
delete from curr_articles where articleId > 0;
delete from curr_comments where commentId > 0;
delete from curr_users where userId > 0;
delete from dict_tags where tagId > 0;
delete from map_articles_tags where articleId > 0;
delete from map_favorites where articleId > 0;
delete from map_followers where userId > 0;
```

Truncate tables not the option because this tables have "Foreign Keys".
