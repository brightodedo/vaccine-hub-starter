const bcrypt = require("bcrypt")
const db = require("../db")
const {BCRYPT_WORK_FACTOR} = require("../config")
const {UnauthorizedError, BadRequestError} = require("../utils/error")


class User{
    static async makePublicUser(user){
        return {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            date: user.date
        }
    }

    static async fetchUserByEmail(email){
        if (!email){
            throw new BadRequestError("email is missing")
        }
        const query = `SELECT * FROM users WHERE email = $1`

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]

        return user
    }

    static async login(credentials){
        const requiredFields = ["email", "password"]

        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError( `Mising ${field} in request body.`)
            }
        })

        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid Email")
        }

        const user = await User.fetchUserByEmail(credentials.email)
        if(user){
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if(isValid){
                return this.makePublicUser(user)
            }
        }
        throw new UnauthorizedError("Invalid username and password")
    }
    static async register(credentials){
        const requiredFields = ["email", "password", "firstName", "lastName", "location", "date"]

        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError( `Mising ${field} in request body.`)
            }
        })

        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid Email")
        }

        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email : ${credentials.email}`)
        }

        const lowerCasedEmail = credentials.email.toLowerCase()

        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)


        const result = await db.query(`
        INSERT INTO users(
            email,
            password,
            first_name,
            last_name,
            location,
            date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, email, first_name, last_name, location, date;
        `, [lowerCasedEmail, hashedPassword, credentials.firstName, credentials.lastName, credentials.location, credentials.date])


        const user = result.rows[0]

        return this.makePublicUser(user) 
    }
}

module.exports = User