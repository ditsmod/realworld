import { HttpServer } from '@ditsmod/core';
import { TestApplication } from '@ditsmod/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createConnection } from 'mysql2/promise';

import { MySqlConfigService } from '#service/mysql/mysql-config.service.js';
import { AppModule } from '#app/app.module.js';

describe('Real World', () => {
  let server: HttpServer;
  let testAgent: ReturnType<typeof request>;
  let slug = '';
  let token = '';
  let commentId = '';
  const email = 'any-email@gmail.com';
  const username = 'any-username';
  const password = 'any-password';
  const dateRegExp = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/;

  beforeAll(async () => {
    server = await TestApplication.createTestApp(AppModule, { path: 'api' }).getServer();
    testAgent = request(server);

    const config = new MySqlConfigService();
    const connection = await createConnection({ ...config, multipleStatements: true });
    await connection.query(`
        SET FOREIGN_KEY_CHECKS=0;
        truncate curr_articles;
        truncate curr_comments;
        truncate curr_users;
        truncate dict_tags;
        truncate map_articles_tags;
        truncate map_favorites;
        truncate map_followers;
        SET FOREIGN_KEY_CHECKS=1;`);
  });

  afterAll(() => {
    server?.close();
  });

  describe('auth', () => {
    it('user registration', async () => {
      const requestBody = { user: { email, password, username } };
      const { status, type, body } = await testAgent
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(requestBody);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body.user).toEqual({
        email,
        username,
        bio: '',
        image: '',
        token: expect.any(String),
      });
    });

    it('user login', async () => {
      const requestBody = { user: { email, password } };
      const { status, type, body } = await testAgent
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send(requestBody);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body.user).toEqual({
        email,
        username,
        bio: null,
        image: null,
        token: expect.any(String),
      });
      token = body.user.token;
    });

    it('get current user', async () => {
      const { status, type, body } = await testAgent.get('/api/user').set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body.user).toEqual({
        email,
        username,
        bio: null,
        image: null,
        token: expect.any(String),
      });
    });

    it('update current user', async () => {
      const requestBody = { user: { email: 'other@i.ua' } };
      const { status, type, body } = await testAgent
        .put('/api/user')
        .set('Authorization', `Token ${token}`)
        .send(requestBody);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body.user).toEqual({
        email,
        username,
        bio: null,
        image: null,
        token: expect.any(String),
      });
    });
  });

  describe('articles', () => {
    it('get all articles', async () => {
      const { status, type, body } = await testAgent.get('/api/articles');

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });
      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(String),
          favorited: expect.any(String),
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('get articles by author', async () => {
      const { status, type, body } = await testAgent.get('/api/articles?author=johnjacob');

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });
      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(String),
          favorited: expect.any(String),
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('get articles favorite by username', async () => {
      const { status, type, body } = await testAgent.get(`/api/articles?favorited=${username}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });
      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(String),
          favorited: expect.any(String),
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('get articles by tag', async () => {
      const { status, type, body } = await testAgent.get('/api/articles?tag=dragons');

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });
      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(Object),
          favorited: expect.any(String),
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });
  });

  describe('articles, favorite, comments', () => {
    it('create article', async () => {
      const requestBody = {
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'Very carefully.',
          tagList: ['training', 'dragons'],
        },
      };
      const { status, type, body } = await testAgent
        .post('/api/articles')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Token ${token}`)
        .send(requestBody);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      slug = body.article.slug;
      expect(body.article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: expect.any(Boolean),
        favoritesCount: expect.any(Number),
      });
    });

    it('feed', async () => {
      const { status, type, body } = await testAgent.get('/api/articles/feed').set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(Object),
          favorited: expect.any(String),
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('all articles', async () => {
      const { status, type, body } = await testAgent.get('/api/articles');

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(Object),
          favorited: false,
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('all articles with auth', async () => {
      const { status, type, body } = await testAgent.get('/api/articles').set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(Object),
          favorited: false,
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('articles by author', async () => {
      const { status, type, body } = await testAgent.get(`/api/articles?author=${username}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(Object),
          favorited: false,
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('articles by author with auth', async () => {
      const { status, type, body } = await testAgent
        .get(`/api/articles?author=${username}`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      if (body.articles?.length) {
        const article = body.articles[0];
        expect(article).toEqual({
          title: expect.any(String),
          slug: expect.any(String),
          body: expect.any(String),
          createdAt: expect.stringMatching(dateRegExp),
          updatedAt: expect.stringMatching(dateRegExp),
          description: expect.any(String),
          tagList: expect.any(Array),
          author: expect.any(Object),
          favorited: false,
          favoritesCount: expect.any(Number),
        });
      } else {
        expect(body.articlesCount).toBe(0);
      }
    });

    it('single article by slug', async () => {
      const { status, type, body } = await testAgent
        .get(`/api/articles/${slug}`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');

      const article = body.article;
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: false,
        favoritesCount: expect.any(Number),
      });
    });

    it('articles by tag', async () => {
      const { status, type, body } = await testAgent
        .get('/api/articles?tag=dragons')
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      const article = body.articles[0];
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: false,
        favoritesCount: expect.any(Number),
      });
      expect(article.tagList).toEqual(['training', 'dragons']);
    });

    it('update article', async () => {
      const { status, type, body } = await testAgent
        .put(`/api/articles/${slug}`)
        .set('Authorization', `Token ${token}`)
        .send({ article: { body: 'With two hands' } });

      expect(status).toBe(200);
      expect(type).toBe('application/json');

      const article = body.article;
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: false,
        favoritesCount: expect.any(Number),
      });
    });

    it('favorite article', async () => {
      const { status, type, body } = await testAgent
        .post(`/api/articles/${slug}/favorite`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');

      const article = body.article;
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: true,
        favoritesCount: expect.any(Number),
      });
      expect(body.article.favoritesCount).greaterThan(0);
    });

    it('article favorited by username', async () => {
      const { status, type, body } = await testAgent.get(`/api/articles?favorited=${username}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      const article = body.articles[0];
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: false,
        favoritesCount: expect.any(Number),
      });
      expect(body.articles[0].favoritesCount).toBe(1);
    });

    it('article favorited by username with auth', async () => {
      const { status, type, body } = await testAgent
        .get(`/api/articles?favorited=${username}`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        articles: expect.any(Array),
        articlesCount: expect.any(Number),
      });

      const article = body.articles[0];
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: true,
        favoritesCount: expect.any(Number),
      });
      expect(body.articles[0].favoritesCount).toBe(1);
    });

    it('unfavorite article', async () => {
      const { status, type, body } = await testAgent
        .del(`/api/articles/${slug}/favorite`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');

      const article = body.article;
      expect(article).toEqual({
        title: expect.any(String),
        slug: expect.any(String),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        description: expect.any(String),
        tagList: expect.any(Array),
        author: expect.any(Object),
        favorited: false,
        favoritesCount: expect.any(Number),
      });
    });

    it('create comment for article', async () => {
      const expectedBody = 'Thank you so much!';
      const { status, type, body } = await testAgent
        .post(`/api/articles/${slug}/comments`)
        .set('Authorization', `Token ${token}`)
        .send({ comment: { body: expectedBody } });

      expect(status).toBe(200);
      expect(type).toBe('application/json');

      const comment = body.comment;
      commentId = comment.id;
      expect(comment).toEqual({
        id: expect.anything(),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        author: expect.any(Object),
      });
      expect(comment.body).toBe(expectedBody);
    });

    it('all comments for article', async () => {
      const expectedBody = 'Thank you so much!';
      const { status, type, body } = await testAgent.get(`/api/articles/${slug}/comments`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        comments: expect.any(Array),
      });

      const comment = body.comments[0];
      expect(comment).toEqual({
        id: expect.anything(),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        author: expect.any(Object),
      });
      expect(comment.body).toBe(expectedBody);
    });

    it('all comments for article with auth', async () => {
      const expectedBody = 'Thank you so much!';
      const { status, type, body } = await testAgent
        .get(`/api/articles/${slug}/comments`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        comments: expect.any(Array),
      });

      const comment = body.comments[0];
      expect(comment).toEqual({
        id: expect.anything(),
        body: expect.any(String),
        createdAt: expect.stringMatching(dateRegExp),
        updatedAt: expect.stringMatching(dateRegExp),
        author: expect.any(Object),
      });
      expect(comment.body).toBe(expectedBody);
    });

    it('delete comment for article', async () => {
      const { status, type } = await testAgent
        .del(`/api/articles/${slug}/comments/${commentId}`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
    });

    it('delete article', async () => {
      const { status, type } = await testAgent.del(`/api/articles/${slug}`).set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
    });
  });

  describe('profiles', () => {
    it('register Celeb', async () => {
      const { status, type, body } = await testAgent
        .post('/api/users')
        .send({ user: { email: `celeb_${email}`, password, username: `celeb_${username}` } });

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        user: expect.any(Object),
      });
      expect(body.user).toEqual({
        email: expect.any(String),
        username: expect.any(String),
        bio: expect.any(String),
        image: expect.any(String),
        token: expect.any(String),
      });
    });

    it('profile', async () => {
      const { status, type, body } = await testAgent
        .get(`/api/profiles/celeb_${username}`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        profile: expect.any(Object),
      });
      expect(body.profile).toEqual({
        username: expect.any(String),
        bio: null,
        image: null,
        following: expect.anything(),
      });
    });

    it('follow profile', async () => {
      const { status, type, body } = await testAgent
        .post(`/api/profiles/celeb_${username}/follow`)
        .set('Authorization', `Token ${token}`)
        .send({ user: { email } });

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        profile: expect.any(Object),
      });
      expect(body.profile).toEqual({
        username: expect.any(String),
        bio: null,
        image: null,
        following: true,
      });
    });

    it('unfollow profile', async () => {
      const { status, type, body } = await testAgent
        .del(`/api/profiles/celeb_${username}/follow`)
        .set('Authorization', `Token ${token}`);

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        profile: expect.any(Object),
      });
      expect(body.profile).toEqual({
        username: expect.any(String),
        bio: null,
        image: null,
        following: false,
      });
    });
  });

  describe('tags', () => {
    it('all tags', async () => {
      const { status, type, body } = await testAgent.get('/api/tags');

      expect(status).toBe(200);
      expect(type).toBe('application/json');
      expect(body).toEqual({
        tags: expect.any(Array),
      });
    });
  });
});
