const db = require("../db")
const {UnauthorizedError, BadRequestError} = require("../utils/error")


class User{
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

    }
    static async register(credentials){
        const requiredFields = ["email", "password", "first_name", "last_name", "location"]

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

        const result = await db.query(`
        INSERT INTO users(
            email,
            password,
            first_name,
            last_name,
            location
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, email, first_name, last_name, location, date;
        `, [lowerCasedEmail, credentials.password, credentials.first_name, credentials.last_name, credentials.location])


        const user = result.rows[0]

        return user 
    }
}

module.exports = User