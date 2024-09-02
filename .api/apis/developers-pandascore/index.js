"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'developers-pandascore/2.54.2 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * List champions
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List champions
     * @throws FetchError<400, types.GetLolChampionsResponse400> Bad request
     * @throws FetchError<401, types.GetLolChampionsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolChampionsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolChampionsResponse404> Not found
     * @throws FetchError<422, types.GetLolChampionsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_champions = function (metadata) {
        return this.core.fetch('/lol/champions', 'get', metadata);
    };
    /**
     * Get a single champion by ID or by slug
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get a champion
     * @throws FetchError<400, types.GetLolChampionsLolChampionIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolChampionsLolChampionIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolChampionsLolChampionIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolChampionsLolChampionIdResponse404> Not found
     * @throws FetchError<422, types.GetLolChampionsLolChampionIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_champions_lolChampionId = function (metadata) {
        return this.core.fetch('/lol/champions/{lol_champion_id}', 'get', metadata);
    };
    /**
     * Get a single League of Legends game by ID
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get a game
     * @throws FetchError<400, types.GetLolGamesLolGameIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolGamesLolGameIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolGamesLolGameIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolGamesLolGameIdResponse404> Not found
     * @throws FetchError<422, types.GetLolGamesLolGameIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_games_lolGameId = function (metadata) {
        return this.core.fetch('/lol/games/{lol_game_id}', 'get', metadata);
    };
    /**
     * List events for a given League of Legends game
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a real-time data plan
     *
     * @summary List Play-by-Play events for a given game
     * @throws FetchError<400, types.GetLolGamesLolGameIdEventsResponse400> Bad request
     * @throws FetchError<401, types.GetLolGamesLolGameIdEventsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolGamesLolGameIdEventsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolGamesLolGameIdEventsResponse404> Not found
     * @throws FetchError<422, types.GetLolGamesLolGameIdEventsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_games_lolGameId_events = function (metadata) {
        return this.core.fetch('/lol/games/{lol_game_id}/events', 'get', metadata);
    };
    /**
     * List frames for a given League of Legends game
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a real-time data plan
     *
     * @summary List Play-by-Play frames for a given game
     * @throws FetchError<400, types.GetLolGamesLolGameIdFramesResponse400> Bad request
     * @throws FetchError<401, types.GetLolGamesLolGameIdFramesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolGamesLolGameIdFramesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolGamesLolGameIdFramesResponse404> Not found
     * @throws FetchError<422, types.GetLolGamesLolGameIdFramesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_games_lolGameId_frames = function (metadata) {
        return this.core.fetch('/lol/games/{lol_game_id}/frames', 'get', metadata);
    };
    /**
     * List items
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List items
     * @throws FetchError<400, types.GetLolItemsResponse400> Bad request
     * @throws FetchError<401, types.GetLolItemsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolItemsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolItemsResponse404> Not found
     * @throws FetchError<422, types.GetLolItemsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_items = function (metadata) {
        return this.core.fetch('/lol/items', 'get', metadata);
    };
    /**
     * Get a single item by ID or by slug
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get an item
     * @throws FetchError<400, types.GetLolItemsLolItemIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolItemsLolItemIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolItemsLolItemIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolItemsLolItemIdResponse404> Not found
     * @throws FetchError<422, types.GetLolItemsLolItemIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_items_lolItemId = function (metadata) {
        return this.core.fetch('/lol/items/{lol_item_id}', 'get', metadata);
    };
    /**
     * List League of Legends leagues
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get LoL leagues
     * @throws FetchError<400, types.GetLolLeaguesResponse400> Bad request
     * @throws FetchError<401, types.GetLolLeaguesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolLeaguesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolLeaguesResponse404> Not found
     * @throws FetchError<422, types.GetLolLeaguesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_leagues = function (metadata) {
        return this.core.fetch('/lol/leagues', 'get', metadata);
    };
    /**
     * List masteries
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List masteries
     * @throws FetchError<400, types.GetLolMasteriesResponse400> Bad request
     * @throws FetchError<401, types.GetLolMasteriesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMasteriesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMasteriesResponse404> Not found
     * @throws FetchError<422, types.GetLolMasteriesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_masteries = function (metadata) {
        return this.core.fetch('/lol/masteries', 'get', metadata);
    };
    /**
     * Get a single mastery by ID
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get a mastery
     * @throws FetchError<400, types.GetLolMasteriesLolMasteryIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolMasteriesLolMasteryIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMasteriesLolMasteryIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMasteriesLolMasteryIdResponse404> Not found
     * @throws FetchError<422, types.GetLolMasteriesLolMasteryIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_masteries_lolMasteryId = function (metadata) {
        return this.core.fetch('/lol/masteries/{lol_mastery_id}', 'get', metadata);
    };
    /**
     * List matches for the League of Legends videogame
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL matches
     * @throws FetchError<400, types.GetLolMatchesResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches = function (metadata) {
        return this.core.fetch('/lol/matches', 'get', metadata);
    };
    /**
     * List past League of Legends matches
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get past LoL matches
     * @throws FetchError<400, types.GetLolMatchesPastResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesPastResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesPastResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesPastResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesPastResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches_past = function (metadata) {
        return this.core.fetch('/lol/matches/past', 'get', metadata);
    };
    /**
     * List running League of Legends matches
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get running LoL matches
     * @throws FetchError<400, types.GetLolMatchesRunningResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesRunningResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesRunningResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesRunningResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesRunningResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches_running = function (metadata) {
        return this.core.fetch('/lol/matches/running', 'get', metadata);
    };
    /**
     * List upcoming League of Legends matches
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get upcoming LoL matches
     * @throws FetchError<400, types.GetLolMatchesUpcomingResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesUpcomingResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesUpcomingResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesUpcomingResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesUpcomingResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches_upcoming = function (metadata) {
        return this.core.fetch('/lol/matches/upcoming', 'get', metadata);
    };
    /**
     * Get a single League of Legends match by ID or slug
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get a LoL match
     * @throws FetchError<400, types.GetLolMatchesMatchIdOrSlugResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesMatchIdOrSlugResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesMatchIdOrSlugResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesMatchIdOrSlugResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesMatchIdOrSlugResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches_matchIdOrSlug = function (metadata) {
        return this.core.fetch('/lol/matches/{match_id_or_slug}', 'get', metadata);
    };
    /**
     * List games for a given League of Legends match
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary List games for a given match
     * @throws FetchError<400, types.GetLolMatchesMatchIdOrSlugGamesResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesMatchIdOrSlugGamesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesMatchIdOrSlugGamesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesMatchIdOrSlugGamesResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesMatchIdOrSlugGamesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches_matchIdOrSlug_games = function (metadata) {
        return this.core.fetch('/lol/matches/{match_id_or_slug}/games', 'get', metadata);
    };
    /**
     * Get detailed statistics of League-of-Legends players for the given match
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL players on match
     * @throws FetchError<400, types.GetLolMatchesMatchIdOrSlugPlayersStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolMatchesMatchIdOrSlugPlayersStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolMatchesMatchIdOrSlugPlayersStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolMatchesMatchIdOrSlugPlayersStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolMatchesMatchIdOrSlugPlayersStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_matches_matchIdOrSlug_players_stats = function (metadata) {
        return this.core.fetch('/lol/matches/{match_id_or_slug}/players/stats', 'get', metadata);
    };
    /**
     * List players for the League of Legends videogame
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL players
     * @throws FetchError<400, types.GetLolPlayersResponse400> Bad request
     * @throws FetchError<401, types.GetLolPlayersResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolPlayersResponse403> Forbidden
     * @throws FetchError<404, types.GetLolPlayersResponse404> Not found
     * @throws FetchError<422, types.GetLolPlayersResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_players = function (metadata) {
        return this.core.fetch('/lol/players', 'get', metadata);
    };
    /**
     * Get detailed statistics of a given League-of-Legends player
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL player
     * @throws FetchError<400, types.GetLolPlayersPlayerIdOrSlugStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolPlayersPlayerIdOrSlugStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolPlayersPlayerIdOrSlugStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolPlayersPlayerIdOrSlugStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolPlayersPlayerIdOrSlugStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_players_playerIdOrSlug_stats = function (metadata) {
        return this.core.fetch('/lol/players/{player_id_or_slug}/stats', 'get', metadata);
    };
    /**
     * List runes
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List runes
     * @throws FetchError<400, types.GetLolRunesResponse400> Bad request
     * @throws FetchError<401, types.GetLolRunesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolRunesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolRunesResponse404> Not found
     * @throws FetchError<422, types.GetLolRunesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_runes = function (metadata) {
        return this.core.fetch('/lol/runes', 'get', metadata);
    };
    /**
     * List the latest version of League of Legends (reforged) runes
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL runes
     * @throws FetchError<400, types.GetLolRunesReforgedResponse400> Bad request
     * @throws FetchError<401, types.GetLolRunesReforgedResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolRunesReforgedResponse403> Forbidden
     * @throws FetchError<404, types.GetLolRunesReforgedResponse404> Not found
     * @throws FetchError<422, types.GetLolRunesReforgedResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_runesReforged = function (metadata) {
        return this.core.fetch('/lol/runes-reforged', 'get', metadata);
    };
    /**
     * List the latest version of League of Legends (reforged) rune paths
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List rune paths
     * @throws FetchError<400, types.GetLolRunesReforgedPathsResponse400> Bad request
     * @throws FetchError<401, types.GetLolRunesReforgedPathsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolRunesReforgedPathsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolRunesReforgedPathsResponse404> Not found
     * @throws FetchError<422, types.GetLolRunesReforgedPathsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_runesReforgedPaths = function (metadata) {
        return this.core.fetch('/lol/runes-reforged-paths', 'get', metadata);
    };
    /**
     * Retrieve the latest version of a League of Legends (reforged) rune path by its ID
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get a LoL rune path
     * @throws FetchError<400, types.GetLolRunesReforgedPathsLolRunePathIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolRunesReforgedPathsLolRunePathIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolRunesReforgedPathsLolRunePathIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolRunesReforgedPathsLolRunePathIdResponse404> Not found
     * @throws FetchError<422, types.GetLolRunesReforgedPathsLolRunePathIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_runesReforgedPaths_lolRunePathId = function (metadata) {
        return this.core.fetch('/lol/runes-reforged-paths/{lol_rune_path_id}', 'get', metadata);
    };
    /**
     * Retrieve the latest version of a League of Legends (reforged) rune by its ID
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get a LoL rune
     * @throws FetchError<400, types.GetLolRunesReforgedLolRuneReforgedIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolRunesReforgedLolRuneReforgedIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolRunesReforgedLolRuneReforgedIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolRunesReforgedLolRuneReforgedIdResponse404> Not found
     * @throws FetchError<422, types.GetLolRunesReforgedLolRuneReforgedIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_runesReforged_lolRuneReforgedId = function (metadata) {
        return this.core.fetch('/lol/runes-reforged/{lol_rune_reforged_id}', 'get', metadata);
    };
    /**
     * Get a single rune by ID
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get a rune
     * @throws FetchError<400, types.GetLolRunesLolRuneIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolRunesLolRuneIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolRunesLolRuneIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolRunesLolRuneIdResponse404> Not found
     * @throws FetchError<422, types.GetLolRunesLolRuneIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_runes_lolRuneId = function (metadata) {
        return this.core.fetch('/lol/runes/{lol_rune_id}', 'get', metadata);
    };
    /**
     * List series for the League of Legends videogame
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL series
     * @throws FetchError<400, types.GetLolSeriesResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series = function (metadata) {
        return this.core.fetch('/lol/series', 'get', metadata);
    };
    /**
     * List past League of Legends series
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get past LoL series
     * @throws FetchError<400, types.GetLolSeriesPastResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesPastResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesPastResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesPastResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesPastResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_past = function (metadata) {
        return this.core.fetch('/lol/series/past', 'get', metadata);
    };
    /**
     * List running League of Legends series
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get running LoL series
     * @throws FetchError<400, types.GetLolSeriesRunningResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesRunningResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesRunningResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesRunningResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesRunningResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_running = function (metadata) {
        return this.core.fetch('/lol/series/running', 'get', metadata);
    };
    /**
     * List upcoming League of Legends series
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get upcoming LoL series
     * @throws FetchError<400, types.GetLolSeriesUpcomingResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesUpcomingResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesUpcomingResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesUpcomingResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesUpcomingResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_upcoming = function (metadata) {
        return this.core.fetch('/lol/series/upcoming', 'get', metadata);
    };
    /**
     * Get detailed statistics of a given League-of-Legends player for the given serie
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL player on serie
     * @throws FetchError<400, types.GetLolSeriesSerieIdOrSlugPlayersPlayerIdOrSlugStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesSerieIdOrSlugPlayersPlayerIdOrSlugStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesSerieIdOrSlugPlayersPlayerIdOrSlugStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesSerieIdOrSlugPlayersPlayerIdOrSlugStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesSerieIdOrSlugPlayersPlayerIdOrSlugStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_serieIdOrSlug_players_playerIdOrSlug_stats = function (metadata) {
        return this.core.fetch('/lol/series/{serie_id_or_slug}/players/{player_id_or_slug}/stats', 'get', metadata);
    };
    /**
     * List teams for the League of Legends videogame for a given serie
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL teams for a serie
     * @throws FetchError<400, types.GetLolSeriesSerieIdOrSlugTeamsResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesSerieIdOrSlugTeamsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesSerieIdOrSlugTeamsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesSerieIdOrSlugTeamsResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesSerieIdOrSlugTeamsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_serieIdOrSlug_teams = function (metadata) {
        return this.core.fetch('/lol/series/{serie_id_or_slug}/teams', 'get', metadata);
    };
    /**
     * Get detailed statistics of the LoL teams for the given series
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL teams on serie
     * @throws FetchError<400, types.GetLolSeriesSerieIdOrSlugTeamsStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesSerieIdOrSlugTeamsStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesSerieIdOrSlugTeamsStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesSerieIdOrSlugTeamsStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesSerieIdOrSlugTeamsStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_serieIdOrSlug_teams_stats = function (metadata) {
        return this.core.fetch('/lol/series/{serie_id_or_slug}/teams/stats', 'get', metadata);
    };
    /**
     * Get detailed statistics of a given League-of-Legends team for the given serie
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL team on serie
     * @throws FetchError<400, types.GetLolSeriesSerieIdOrSlugTeamsTeamIdOrSlugStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolSeriesSerieIdOrSlugTeamsTeamIdOrSlugStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSeriesSerieIdOrSlugTeamsTeamIdOrSlugStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSeriesSerieIdOrSlugTeamsTeamIdOrSlugStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolSeriesSerieIdOrSlugTeamsTeamIdOrSlugStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_series_serieIdOrSlug_teams_teamIdOrSlug_stats = function (metadata) {
        return this.core.fetch('/lol/series/{serie_id_or_slug}/teams/{team_id_or_slug}/stats', 'get', metadata);
    };
    /**
     * List spells
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List spells
     * @throws FetchError<400, types.GetLolSpellsResponse400> Bad request
     * @throws FetchError<401, types.GetLolSpellsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSpellsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSpellsResponse404> Not found
     * @throws FetchError<422, types.GetLolSpellsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_spells = function (metadata) {
        return this.core.fetch('/lol/spells', 'get', metadata);
    };
    /**
     * Get a single spell by ID
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get a spell
     * @throws FetchError<400, types.GetLolSpellsLolSpellIdResponse400> Bad request
     * @throws FetchError<401, types.GetLolSpellsLolSpellIdResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolSpellsLolSpellIdResponse403> Forbidden
     * @throws FetchError<404, types.GetLolSpellsLolSpellIdResponse404> Not found
     * @throws FetchError<422, types.GetLolSpellsLolSpellIdResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_spells_lolSpellId = function (metadata) {
        return this.core.fetch('/lol/spells/{lol_spell_id}', 'get', metadata);
    };
    /**
     * List teams for the League of Legends videogame
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL teams
     * @throws FetchError<400, types.GetLolTeamsResponse400> Bad request
     * @throws FetchError<401, types.GetLolTeamsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTeamsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTeamsResponse404> Not found
     * @throws FetchError<422, types.GetLolTeamsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_teams = function (metadata) {
        return this.core.fetch('/lol/teams', 'get', metadata);
    };
    /**
     * List finished games for a given League of Legends team
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary List finished games for a given team
     * @throws FetchError<400, types.GetLolTeamsTeamIdOrSlugGamesResponse400> Bad request
     * @throws FetchError<401, types.GetLolTeamsTeamIdOrSlugGamesResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTeamsTeamIdOrSlugGamesResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTeamsTeamIdOrSlugGamesResponse404> Not found
     * @throws FetchError<422, types.GetLolTeamsTeamIdOrSlugGamesResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_teams_teamIdOrSlug_games = function (metadata) {
        return this.core.fetch('/lol/teams/{team_id_or_slug}/games', 'get', metadata);
    };
    /**
     * Get detailed statistics of a given League-of-Legends team
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL team
     * @throws FetchError<400, types.GetLolTeamsTeamIdOrSlugStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolTeamsTeamIdOrSlugStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTeamsTeamIdOrSlugStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTeamsTeamIdOrSlugStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolTeamsTeamIdOrSlugStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_teams_teamIdOrSlug_stats = function (metadata) {
        return this.core.fetch('/lol/teams/{team_id_or_slug}/stats', 'get', metadata);
    };
    /**
     * List tournaments for the League of Legends videogame
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List LoL tournaments
     * @throws FetchError<400, types.GetLolTournamentsResponse400> Bad request
     * @throws FetchError<401, types.GetLolTournamentsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTournamentsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTournamentsResponse404> Not found
     * @throws FetchError<422, types.GetLolTournamentsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_tournaments = function (metadata) {
        return this.core.fetch('/lol/tournaments', 'get', metadata);
    };
    /**
     * List past League of Legends tournaments
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get past LoL tournaments
     * @throws FetchError<400, types.GetLolTournamentsPastResponse400> Bad request
     * @throws FetchError<401, types.GetLolTournamentsPastResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTournamentsPastResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTournamentsPastResponse404> Not found
     * @throws FetchError<422, types.GetLolTournamentsPastResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_tournaments_past = function (metadata) {
        return this.core.fetch('/lol/tournaments/past', 'get', metadata);
    };
    /**
     * List running League of Legends tournaments
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get running LoL tournaments
     * @throws FetchError<400, types.GetLolTournamentsRunningResponse400> Bad request
     * @throws FetchError<401, types.GetLolTournamentsRunningResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTournamentsRunningResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTournamentsRunningResponse404> Not found
     * @throws FetchError<422, types.GetLolTournamentsRunningResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_tournaments_running = function (metadata) {
        return this.core.fetch('/lol/tournaments/running', 'get', metadata);
    };
    /**
     * List upcoming League of Legends tournaments
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary Get upcoming LoL tournaments
     * @throws FetchError<400, types.GetLolTournamentsUpcomingResponse400> Bad request
     * @throws FetchError<401, types.GetLolTournamentsUpcomingResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTournamentsUpcomingResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTournamentsUpcomingResponse404> Not found
     * @throws FetchError<422, types.GetLolTournamentsUpcomingResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_tournaments_upcoming = function (metadata) {
        return this.core.fetch('/lol/tournaments/upcoming', 'get', metadata);
    };
    /**
     * Get detailed statistics of a given League-of-Legends player for the given tournament
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL player on tournament
     * @throws FetchError<400, types.GetLolTournamentsTournamentIdOrSlugPlayersPlayerIdOrSlugStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolTournamentsTournamentIdOrSlugPlayersPlayerIdOrSlugStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTournamentsTournamentIdOrSlugPlayersPlayerIdOrSlugStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTournamentsTournamentIdOrSlugPlayersPlayerIdOrSlugStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolTournamentsTournamentIdOrSlugPlayersPlayerIdOrSlugStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_tournaments_tournamentIdOrSlug_players_playerIdOrSlug_stats = function (metadata) {
        return this.core.fetch('/lol/tournaments/{tournament_id_or_slug}/players/{player_id_or_slug}/stats', 'get', metadata);
    };
    /**
     * Get detailed statistics of a given League-of-Legends team for the given tournament
     * > ℹ️
     * >
     * > This endpoint is only available to customers with a historical or real-time data plan
     *
     * @summary Get stats for LoL team on tournament
     * @throws FetchError<400, types.GetLolTournamentsTournamentIdOrSlugTeamsTeamIdOrSlugStatsResponse400> Bad request
     * @throws FetchError<401, types.GetLolTournamentsTournamentIdOrSlugTeamsTeamIdOrSlugStatsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolTournamentsTournamentIdOrSlugTeamsTeamIdOrSlugStatsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolTournamentsTournamentIdOrSlugTeamsTeamIdOrSlugStatsResponse404> Not found
     * @throws FetchError<422, types.GetLolTournamentsTournamentIdOrSlugTeamsTeamIdOrSlugStatsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_tournaments_tournamentIdOrSlug_teams_teamIdOrSlug_stats = function (metadata) {
        return this.core.fetch('/lol/tournaments/{tournament_id_or_slug}/teams/{team_id_or_slug}/stats', 'get', metadata);
    };
    /**
     * Deprecated. Equivalent route:
     * [/lol/champions?filter[videogame_version]=all](/reference/get_lol_champions)
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List champions for all version
     * @throws FetchError<400, types.GetLolVersionsAllChampionsResponse400> Bad request
     * @throws FetchError<401, types.GetLolVersionsAllChampionsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolVersionsAllChampionsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolVersionsAllChampionsResponse404> Not found
     * @throws FetchError<422, types.GetLolVersionsAllChampionsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_versions_all_champions = function (metadata) {
        return this.core.fetch('/lol/versions/all/champions', 'get', metadata);
    };
    /**
     * Deprecated. Equivalent route:
     * [/lol/items?filter[videogame_version]=all](/reference/get_lol_items)
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List items for all version
     * @throws FetchError<400, types.GetLolVersionsAllItemsResponse400> Bad request
     * @throws FetchError<401, types.GetLolVersionsAllItemsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolVersionsAllItemsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolVersionsAllItemsResponse404> Not found
     * @throws FetchError<422, types.GetLolVersionsAllItemsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_versions_all_items = function (metadata) {
        return this.core.fetch('/lol/versions/all/items', 'get', metadata);
    };
    /**
     * Deprecated. Equivalent route:
     * [/lol/champions?filter[videogame_version]={lol_version_name}](/reference/get_lol_champions)
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List champions for version
     * @throws FetchError<400, types.GetLolVersionsLolVersionNameChampionsResponse400> Bad request
     * @throws FetchError<401, types.GetLolVersionsLolVersionNameChampionsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolVersionsLolVersionNameChampionsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolVersionsLolVersionNameChampionsResponse404> Not found
     * @throws FetchError<422, types.GetLolVersionsLolVersionNameChampionsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_versions_lolVersionName_champions = function (metadata) {
        return this.core.fetch('/lol/versions/{lol_version_name}/champions', 'get', metadata);
    };
    /**
     * Deprecated. Equivalent route:
     * [/lol/items?filter[videogame_version]={lol_version_name}](/reference/get_lol_items)
     * > ℹ️
     * >
     * > This endpoint is available to all customers
     *
     * @summary List items for version
     * @throws FetchError<400, types.GetLolVersionsLolVersionNameItemsResponse400> Bad request
     * @throws FetchError<401, types.GetLolVersionsLolVersionNameItemsResponse401> Unauthorized
     * @throws FetchError<403, types.GetLolVersionsLolVersionNameItemsResponse403> Forbidden
     * @throws FetchError<404, types.GetLolVersionsLolVersionNameItemsResponse404> Not found
     * @throws FetchError<422, types.GetLolVersionsLolVersionNameItemsResponse422> Unprocessable Entity
     */
    SDK.prototype.get_lol_versions_lolVersionName_items = function (metadata) {
        return this.core.fetch('/lol/versions/{lol_version_name}/items', 'get', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
