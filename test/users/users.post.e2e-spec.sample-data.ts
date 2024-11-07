import { faker } from "@faker-js/faker"

export const completUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'Asdfghjkl!1'
}

export const missingFirstName = {
    ...completUser,
    firstName: null
}

export const missingEmail = {
    ...completUser,
    email: null
}

export const missingPassword = {
    ...completUser,
    password: null
}