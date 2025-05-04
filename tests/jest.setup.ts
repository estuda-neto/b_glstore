import supertest from "supertest";
import app from '../src/server';

const testServer = supertest(app);

export default testServer;