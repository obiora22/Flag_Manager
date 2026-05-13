import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
    console.error("❌ FATAL ERROR: API_JWT_SECRET environment variable is not set");
    console.error("Please set API_JWT_SECRET in your .env file");
    process.exit(1);
}
``;
const SECRET = AUTH_SECRET;
const authPlugin = async (fastify) => {
    fastify.decorateRequest("user", null);
    fastify.addHook("preHandler", async (request, reply) => {
        const publicRoutes = ["/api/v1/health", "/api/v1/users/email"];
        const isPublicRoute = publicRoutes.find((route) => {
            return request.url.startsWith(route);
        });
        if (isPublicRoute)
            return;
        const authHeader = request.headers.authorization;
        if (!authHeader)
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Missing authorization header",
            });
        if (!authHeader.startsWith("Bearer"))
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Invalid authorization schema: Bearer schema expected.",
            });
        const token = authHeader.substring(7);
        if (!token)
            return reply.status(401).send({
                erorr: "Unauthorized",
                message: "Token is missing",
            });
        try {
            const payload = jwt.verify(token, SECRET);
            request.user = {
                id: payload.sub,
                activeOrgId: payload.activeOrgId,
                activeRole: payload.activeRole,
                memberships: payload.memberships,
            };
        }
        catch (err) {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Unverifiable token",
            });
        }
    });
};
export default fp(authPlugin);
//# sourceMappingURL=auth.js.map