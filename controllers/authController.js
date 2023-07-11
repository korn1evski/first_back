const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')

const handleLogin = async(req, res) => {
    const {user, pwd} = req.body;
    if(!user || !pwd)
        return res.status(400).json({"message" : "username and password are required"})
    const foundUser = await User.findOne({username: user}).exec()
    if(!foundUser) return res.sendStatus(401); //Unauthorized

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){
        roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign(
            {"UserInfo" : {
                "username" : foundUser.username,
                "roles" : roles
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '30s'
            }
        )
        const refreshToken = jwt.sign(
            {"username" : foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        );

        foundUser.refreshToken = refreshToken
        await foundUser.save()


        // const otherUsers = userDb.users.filter(tempUser => tempUser.username !== foundUser.username)
        // const currentUser = {...foundUser, refreshToken};
        // userDb.setUsers([...otherUsers, currentUser])
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(userDb.users)
        // )
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000})
        res.json({accessToken})
    }
    else
        res.sendStatus(401)
    }

    module.exports = {handleLogin}