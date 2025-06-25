import express from "express";
import { createServer } from "http";
import { AppDataSource } from "./infrastructure/database/database";
import { PartnerController } from "./infrastructure/controller/partner.controller";
import { PartnerRoutes } from "./routes/partner.routes";
import { PartnerService } from "./service/partner.service";
import { PartnerRepository } from "./repository/partners.repository";
import { Partner } from "./infrastructure/entity/partners.entity";
import { setupSwagger } from "./config/swagger";


const PORT = 2224;
const app = express();
const httpServer = createServer(app);
app.use(express.json());
setupSwagger(app);
const partnerRoutes = new PartnerRoutes(
  new PartnerController(
    new PartnerService(
      new PartnerRepository( AppDataSource.getRepository(Partner))
    )
  )
)
  

app.use("/api/partners", partnerRoutes.getRoutes());

httpServer.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
