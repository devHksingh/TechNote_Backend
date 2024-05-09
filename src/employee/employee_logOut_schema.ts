import { body } from "express-validator";

const schema = [
    body('id')
        .isString()
        .notEmpty()
]

export {schema as employeeLogoutSchema}