import Elysia, { t } from "elysia";

const RequestMessage = t.Union([
  t.Object({
    type: t.Literal("login"),
    data: t.String(),
  }),
  t.Object({
    type: t.Literal("subscribe"),
    data: t.Array(t.String()),
  }),
]);

const ResponseMessage = t.Union([
  t.Object({
    type: t.Literal("msg"),
    data: t.String(),
  }),
  t.Object({
    type: t.Literal("tweet"),
    data: t.Object({
      created_at: t.String(),
      id: t.String(),
      full_text: t.String(),
      truncated: t.Boolean(),
      entities: t.Object({
        hashtags: t.Array(
          t.Object({
            text: t.String(),
            indices: t.Array(t.Number()),
          })
        ),
        symbols: t.Array(
          t.Object({
            text: t.String(),
            indices: t.Array(t.Number()),
          })
        ),
        user_mentions: t.Array(
          t.Object({
            screen_name: t.String(),
            name: t.String(),
            id: t.String(),
            indices: t.Array(t.Number()),
          })
        ),
        urls: t.Array(
          t.Object({
            url: t.String(),
            expanded_url: t.String(),
            display_url: t.String(),
            indices: t.Array(t.Number()),
          })
        ),
      }),
      source: t.String(),
      in_reply_to_status_id: t.String(),
      in_reply_to_user_id: t.String(),
      in_reply_to_screen_name: t.String(),
      is_quote_status: t.Boolean(),
      retweet_count: t.Number(),
      favorite_count: t.Number(),
      possibly_sensitive: t.Boolean(),
      lang: t.String(),
      user: t.Object({
        id: t.String(),
        name: t.String(),
        screen_name: t.String(),
        location: t.String(),
        url: t.String(),
        description: t.String(),
        protected: t.Boolean(),
        followers_count: t.Number(),
        friends_count: t.Number(),
        listed_count: t.Number(),
        created_at: t.String(),
        favourites_count: t.Number(),
        verified: t.Boolean(),
        statuses_count: t.Number(),
        profile_image_url: t.String(),
        default_profile_image: t.Boolean(),
      }),
      clean: t.Boolean(),
      meta: t.Object({
        receivedDate: t.Number(),
        tweetedDate: t.Number(),
        willUpdate: t.Boolean(),
        latency: t.Number(),
      }),
    }),
  }),
  // t.Any(),
]);

const twitter_app = new Elysia().ws("/", {
  response: ResponseMessage,
  body: RequestMessage,
});

export type Twitter = typeof twitter_app;
