export const enum Permission {
  /**
   * Can activate `/administration` secrion
   */
  canActivateAdministration = 1,
  /**
   * Can activate `/administration/posts-review` secrion
   */
  canActivatePostsReview = 2,
  /**
   * Can change any post (is a moderator).
   */
  canEditAnyPost = 3,
  /**
   * Can publish any post (is a moderator).
   */
  canPublishAnyPost = 4,
  /**
   * Can hide any post (is a moderator).
   */
  canHideAnyPost = 5,
  /**
   * Can change any post (is a moderator).
   */
  canDeleteAnyPost = 6,
  /**
   * Can delete any article's comment (is a moderator).
   */
  canDeleteAnyComments = 7,
}
