import request from 'supertest';
import {app} from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'not_an_email',
            password: 'password'
        })
        .expect(400, '{"errors":[{"message":"email must be valid","field":"email"}]}');
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'not_an_email',
            password: 'p'
        })
        .expect(400, '' +
            '{"errors":[{"message":"email must be valid","field":"email"},' +
            '{"message":"password must be between 4 and 20 characters","field":"password"}]}');
});

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400, '{"errors":[{"message":"password must be between 4 and 20 characters","field":"password"}]}');

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'pppqqq'
        })
        .expect(400, '{"errors":[{"message":"email must be valid","field":"email"}]}');
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400, '{"errors":[{"message":"User already exists"}]}');
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
