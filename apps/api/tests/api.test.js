import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

describe('GreenDC India Express API Integration Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    const app = createApp();
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('1. GET /api/health', () => {
    it('should return 200 OK with service health details and uptime', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.equal(res.status, 200);

      const body = await res.json();
      assert.equal(body.status, 'healthy');
      assert.equal(body.service, 'greendc-india-api');
      assert.equal(body.version, '1.0.0');
      assert.ok(typeof body.timestamp === 'string');
      assert.ok(typeof body.uptimeSeconds === 'number');
    });
  });

  describe('2. POST /api/simulations/calculate - Valid Scenarios', () => {
    it('should calculate reference scenario with exact values and metadata', async () => {
      const payload = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.4,
        wue: 1.2
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 200);
      const data = await res.json();

      // Check outputs
      assert.equal(data.outputs.facilityPowerMW, 15);
      assert.equal(data.outputs.annualITEnergyKWh, 70080000);
      assert.equal(data.outputs.annualFacilityEnergyKWh, 105120000);
      assert.equal(data.outputs.annualOverheadEnergyKWh, 35040000);
      assert.equal(data.outputs.renewableEquivalentKWh, 42048000);
      assert.equal(data.outputs.estimatedWaterLitres, 84096000);
      assert.equal(data.outputs.estimatedWaterML, 84.096);

      // Check units
      assert.equal(data.units.facilityPowerMW, 'MW');
      assert.equal(data.units.annualITEnergyKWh, 'kWh/year');
      assert.equal(data.units.annualFacilityEnergyKWh, 'kWh/year');
      assert.equal(data.units.estimatedWaterLitres, 'Litres/year');
      assert.equal(data.units.estimatedWaterML, 'Megalitres/year');

      // Check provenance & data classification
      assert.equal(data.metadata.dataStatus.inputs.itLoadMW, 'user_assumption');
      assert.equal(data.metadata.dataStatus.outputs.estimatedWaterLitres, 'calculated_estimate');
      assert.equal(data.metadata.dataStatus.outputs.renewableEquivalentKWh, 'scenario_estimate');
      assert.ok(data.metadata.disclaimers.renewableEquivalent.includes('scenario calculation'));
    });

    it('should return null and unavailable status when WUE is null', async () => {
      const payload = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.4,
        wue: null
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 200);
      const data = await res.json();

      assert.equal(data.outputs.estimatedWaterLitres, null);
      assert.equal(data.outputs.estimatedWaterML, null);
      assert.equal(data.metadata.dataStatus.outputs.estimatedWaterLitres, 'unavailable');
      assert.equal(data.metadata.dataStatus.outputs.estimatedWaterML, 'unavailable');
    });

    it('should return null and unavailable status when WUE is omitted', async () => {
      const payload = {
        itLoadMW: 20,
        pue: 1.2,
        utilisation: 0.9,
        renewableShare: 0.6
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 200);
      const data = await res.json();

      assert.equal(data.outputs.estimatedWaterLitres, null);
      assert.equal(data.outputs.estimatedWaterML, null);
      assert.equal(data.metadata.dataStatus.outputs.estimatedWaterLitres, 'unavailable');
    });
  });

  describe('3. POST /api/simulations/calculate - Validation & Error Responses', () => {
    it('should return 400 VALIDATION_ERROR when itLoadMW is missing', async () => {
      const payload = {
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.5
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error.code, 'MISSING_FIELD');
      assert.equal(data.error.field, 'itLoadMW');
      assert.ok(data.error.message.includes('IT load (MW) is required'));
    });

    it('should return 400 when PUE is below 1.0', async () => {
      const payload = {
        itLoadMW: 10,
        pue: 0.95,
        utilisation: 0.8,
        renewableShare: 0.5
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error.code, 'OUT_OF_RANGE');
      assert.equal(data.error.field, 'pue');
      assert.ok(data.error.message.includes('PUE must be at least 1'));
    });

    it('should return 400 when utilisation is greater than 1.0', async () => {
      const payload = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 80, // sent 80 instead of 0.8
        renewableShare: 0.5
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error.code, 'OUT_OF_RANGE');
      assert.equal(data.error.field, 'utilisation');
    });

    it('should return 400 when WUE is outside allowed range (e.g. > 5.0)', async () => {
      const payload = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.5,
        wue: 7.5
      };

      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error.code, 'OUT_OF_RANGE');
      assert.equal(data.error.field, 'wue');
    });
  });

  describe('4. Request Parsing & Client Error Handling', () => {
    it('should return 400 BAD_REQUEST for malformed JSON without exposing stack traces', async () => {
      const res = await fetch(`${baseUrl}/api/simulations/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"itLoadMW": 10, "pue": invalid_json}'
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error.code, 'BAD_REQUEST');
      assert.equal(data.error.message, 'Malformed JSON payload in request body');
      assert.equal(data.stack, undefined);
    });

    it('should return 404 NOT_FOUND for unknown routes', async () => {
      const res = await fetch(`${baseUrl}/api/unknown-endpoint`);
      assert.equal(res.status, 404);

      const data = await res.json();
      assert.equal(data.error.code, 'NOT_FOUND');
    });
  });
});
