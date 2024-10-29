const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const { auth } = require('express-openid-connect');
const app = express();
const port = 3000;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'IBff1fjsB1gWUJkFKGGZtjoy8yA8onDU',
    issuerBaseURL: 'https://dev-dkx8zvydzzgv07gj.us.auth0.com',
};

app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'secreta', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(auth(config));

passport.use(
    new FacebookStrategy(
        {
            clientID: 'SEU_FACEBOOK_APP_ID',
            clientSecret: 'SEU_FACEBOOK_APP_SECRET',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const { id, emails, name } = profile;
            const email = emails[0].value;

            try {
                let user = await User.findOne({ email });
                if (!user) {
                    user = new User({
                        username: name.givenName + ' ' + name.familyName,
                        email,
                        password: 'FacebookLogin',
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    }
);

mongoose
    .connect('mongodb://localhost:27017/musicSocialApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error);
    });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

const activitySchema = new mongoose.Schema({
    userId: String,
    musicId: String,
    timestamp: { type: Date, default: Date.now },
});

const Activity = mongoose.model('Activity', activitySchema);

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            phone,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email ou senha inválidos' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Email ou senha inválidos' });
        }
        const token = jwt.sign({ userId: user._id }, 'secreta', {
            expiresIn: '1h',
        });
        res.json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

app.get('/api/activities/feed', async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ timestamp: -1 })
            .limit(10);
        res.json(activities);
    } catch (error) {
        console.error('Erro ao obter o feed de atividades:', error);
        res.status(500).json({ error: 'Erro ao obter o feed de atividades' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
