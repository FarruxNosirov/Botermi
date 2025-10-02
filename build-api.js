#!/usr/bin/env node

/**
 * Botermi Universal Build API
 * RESTful API for triggering builds for both Android and iOS
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class BuildAPI {
  constructor() {
    this.buildQueue = [];
    this.currentBuild = null;
    this.buildHistory = [];
  }

  /**
   * Execute shell command and return promise
   */
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      console.log(`🔧 Executing: ${command}`);

      const process = exec(command, {
        cwd: __dirname,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data;
        console.log(`📤 ${data.toString().trim()}`);
      });

      process.stderr.on('data', (data) => {
        stderr += data;
        console.error(`📥 ${data.toString().trim()}`);
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, stdout, stderr });
        } else {
          reject({ success: false, code, stdout, stderr });
        }
      });
    });
  }

  /**
   * Build for specific platform(s)
   */
  async buildApp(platforms = 'all', profile = 'production') {
    const buildId = `build-${Date.now()}`;
    const buildData = {
      id: buildId,
      platforms,
      profile,
      status: 'starting',
      startTime: new Date().toISOString(),
      logs: [],
    };

    this.currentBuild = buildData;
    this.buildHistory.unshift(buildData);

    try {
      console.log(`🚀 Starting build: ${buildId}`);
      console.log(`📱 Platforms: ${platforms}`);
      console.log(`🏷️ Profile: ${profile}`);

      buildData.status = 'building';
      buildData.logs.push(`Build started for ${platforms} with profile ${profile}`);

      // Execute EAS build command
      const command = `eas build --platform ${platforms} --profile ${profile} --non-interactive --no-wait`;
      const result = await this.executeCommand(command);

      buildData.status = 'completed';
      buildData.endTime = new Date().toISOString();
      buildData.success = result.success;
      buildData.output = result.stdout;
      buildData.logs.push('Build completed successfully');

      console.log(`✅ Build ${buildId} completed successfully!`);
      return buildData;
    } catch (error) {
      buildData.status = 'failed';
      buildData.endTime = new Date().toISOString();
      buildData.success = false;
      buildData.error = error.stderr || error.message;
      buildData.logs.push(`Build failed: ${error.stderr || error.message}`);

      console.error(`❌ Build ${buildId} failed:`, error);
      throw error;
    } finally {
      this.currentBuild = null;
    }
  }

  /**
   * Submit app to stores
   */
  async submitApp(platforms = 'all', profile = 'production') {
    try {
      console.log(`📤 Submitting to stores: ${platforms}`);

      const command = `eas submit --platform ${platforms} --profile ${profile} --non-interactive --no-wait`;
      const result = await this.executeCommand(command);

      console.log(`✅ Submission completed for ${platforms}`);
      return result;
    } catch (error) {
      console.error(`❌ Submission failed for ${platforms}:`, error);
      throw error;
    }
  }

  /**
   * Get build status
   */
  getBuildStatus() {
    return {
      currentBuild: this.currentBuild,
      queue: this.buildQueue,
      history: this.buildHistory.slice(0, 10), // Last 10 builds
    };
  }

  /**
   * Get build list from EAS
   */
  async getBuildList(limit = 10) {
    try {
      const command = `eas build:list --limit ${limit} --json`;
      const result = await this.executeCommand(command);
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('❌ Failed to get build list:', error);
      throw error;
    }
  }
}

// API Endpoints
const buildAPI = new BuildAPI();

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const platforms = args[1] || 'all';
  const profile = args[2] || 'production';

  console.log('🚀 Botermi Build API');
  console.log('====================');

  try {
    switch (command) {
      case 'build':
        console.log(`📱 Building for: ${platforms}`);
        const result = await buildAPI.buildApp(platforms, profile);
        console.log('✅ Build Result:', JSON.stringify(result, null, 2));
        break;

      case 'submit':
        console.log(`📤 Submitting: ${platforms}`);
        const submitResult = await buildAPI.submitApp(platforms, profile);
        console.log('✅ Submit Result:', JSON.stringify(submitResult, null, 2));
        break;

      case 'status':
        const status = buildAPI.getBuildStatus();
        console.log('📊 Build Status:', JSON.stringify(status, null, 2));
        break;

      case 'list':
        const builds = await buildAPI.getBuildList(10);
        console.log('📋 Recent Builds:', JSON.stringify(builds, null, 2));
        break;

      case 'production':
        console.log('🏪 Building for production (App Store + Google Play)');
        await buildAPI.buildApp('all', 'production');
        break;

      case 'preview':
        console.log('🔍 Building preview versions');
        await buildAPI.buildApp('all', 'preview-all');
        break;

      default:
        console.log(`
Usage: node build-api.js <command> [platforms] [profile]

Commands:
  build [platforms] [profile]  - Build app
  submit [platforms] [profile] - Submit to stores
  status                       - Show build status
  list                         - Show recent builds
  production                   - Build for production
  preview                      - Build preview versions

Examples:
  node build-api.js build all production
  node build-api.js build android production
  node build-api.js build ios production
  node build-api.js submit all production
  node build-api.js production
  node build-api.js preview
                `);
    }
  } catch (error) {
    console.error('❌ Command failed:', error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = BuildAPI;

// Run as CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}
