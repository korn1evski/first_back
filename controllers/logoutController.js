const path = require('path')
const User = require('./../model/User')


const handleLogout = async (req, res) => {
    //On client, also delete access token
    const cookies = req.cookies
    if(!cookies?.jwt)
        return res.sendStatus(204) // No content
    const refreshToken = cookies.jwt;
    //Is refresh token in the database
    const foundUser = await User.findOne({refreshToken}).exec()
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'})
        return res.sendStatus(204)
    }



    // Delete refresh token in the database

    foundUser.refreshToken = ''
    const result = await foundUser.save()
    // const otherUsers = userDb.users.filter(tempUser => tempUser.refreshToken !== foundUser.refreshToken)
    // const currentUser = {...foundUser, refreshToken: ''}
    // userDb.setUsers([...otherUsers, currentUser])
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDb.users), 'utf-8')
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None'})
    // in production serure: true - only serves on https
    res.sendStatus(204)
}


module.exports = {handleLogout}