import { Logger } from '../utils/Logger';
import express, { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import kleur from 'kleur';
import http from 'http';
import bodyParser from 'body-parser';
// import passport from 'passport';
// import { Strategy } from 'passport-discord';
// import DiscordScopes from './DiscordScopes';
// import session from 'express-session';
// import GuildManager from '../database/GuildManager';
import path from 'path';

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'MIDDLEWARE';

class HTTPServer extends Logger {
  private static instance: HTTPServer;

  private readonly apiRouter: Router;

  private readonly server: http.Server;

  private constructor() {
    super();
    HTTPServer.instance = this;

    const app = express();
    // this.app = app;

    // // TODO: Properly implement all of this passport stuff!
    // passport.serializeUser(function(user, done) {
    //   done(null, user);
    // });
    // passport.deserializeUser(function(obj, done) {
    //   done(null, obj);
    // });
    //
    // passport.use(
    //   new Strategy(
    //     {
    //       clientID: '647856078612332614',
    //       clientSecret: 'X9IqqE-1cfpilrVTJHDuVMZkh1bOBh7w',
    //       callbackURL: 'http://localhost:5000/callback', // TODO: Configure
    //       scope: DiscordScopes
    //     },
    //     (accessToken, refreshToken, profile, done) => {
    //       process.nextTick(function() {
    //         return done(null, profile);
    //       });
    //     }
    //   )
    // );
    //
    // function checkAuth(req: Request, res: Response, next: NextFunction) {
    //   if (req.isAuthenticated()) return next();
    //   res.send('not logged in :(');
    // }
    //
    // app.use(
    //   session({
    //     secret: 'keyboard cat', // TODO: CHANGE!
    //     resave: false,
    //     saveUninitialized: false
    //   })
    // );
    // app.use(passport.initialize());
    // app.use(passport.session());
    // app.get(
    //   '/',
    //   passport.authenticate('discord', {
    //     scope: DiscordScopes,
    //     prompt: 'consent'
    //   }),
    //   function(req, res) {
    //     // do nothing
    //   }
    // );
    // app.get(
    //   '/callback',
    //   passport.authenticate('discord', { failureRedirect: '/' }),
    //   function(req, res) {
    //     res.redirect('/info');
    //   } // auth success
    // );
    // app.get('/logout', function(req, res) {
    //   req.logout();
    //   res.redirect('/');
    // });
    // app.get('/info', checkAuth, async function(req, res) {
    //   const user: any = req.user;
    //   const guilds = user.guilds.map((g: any) => g.id);
    //
    //   console.log(guilds);
    //
    //   const overlappingGuilds = await GuildManager.get().getGuilds(guilds);
    //
    //   res.json({
    //     guilds: overlappingGuilds
    //   });
    // });

    app.use(HTTPServer.logRequest.bind(this));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const publicPath = path.join(__dirname, '../', '../', '../', 'public');

    app.use(express.static(publicPath));

    const apiRouter = express.Router();
    app.use('/api', apiRouter);

    app.get('*', (req, res, next) => {
      if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(publicPath, 'index.html'));
      } else {
        next();
      }
    });

    this.server = http.createServer(app);

    this.apiRouter = apiRouter;

    http.createServer();
  }

  public static get() {
    return HTTPServer.instance || new HTTPServer();
  }

  private static logRequest(
    request: Request,
    _response: Response,
    next: NextFunction
  ) {
    HTTPServer.log(
      `${kleur.magenta(request.method)} ${kleur.cyan(request.path)}`
    );
    next();
  }

  public listen() {
    this.server.listen(process.env.PORT || 5000);
    HTTPServer.log(
      'Server listening on port ' + kleur.magenta(process.env.PORT || 5000)
    );
  }

  public addRoute(
    path: string | RegExp,
    method: HTTPMethod,
    func: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) {
    switch (method) {
      case 'GET':
        this.apiRouter.get(path, func);
        break;
      case 'POST':
        this.apiRouter.post(path, func);
        break;
      case 'PATCH':
        this.apiRouter.patch(path, func);
        break;
      case 'DELETE':
        this.apiRouter.delete(path, func);
        break;
      case 'MIDDLEWARE':
        this.apiRouter.use(path, func);
        break;
    }
  }
}

export default HTTPServer;
