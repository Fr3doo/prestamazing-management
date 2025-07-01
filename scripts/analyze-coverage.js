
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Analyze test coverage and provide detailed report
 */
function analyzeCoverage() {
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage.json');
  
  if (!fs.existsSync(coveragePath)) {
    console.log('❌ No coverage data found. Run npm run test:coverage first.');
    return;
  }

  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  
  console.log('📊 COVERAGE ANALYSIS REPORT');
  console.log('=' .repeat(50));
  
  const files = Object.keys(coverage);
  const uncoveredFiles = [];
  const partiallyUncoveredFiles = [];
  
  files.forEach(filePath => {
    const file = coverage[filePath];
    const stats = file.summary;
    
    const linesCoverage = stats.lines.pct;
    const branchesCoverage = stats.branches.pct;
    const functionsCoverage = stats.functions.pct;
    const statementsCoverage = stats.statements.pct;
    
    const averageCoverage = (linesCoverage + branchesCoverage + functionsCoverage + statementsCoverage) / 4;
    
    if (averageCoverage === 0) {
      uncoveredFiles.push({
        path: filePath,
        coverage: averageCoverage
      });
    } else if (averageCoverage < 100) {
      partiallyUncoveredFiles.push({
        path: filePath,
        coverage: averageCoverage,
        details: {
          lines: linesCoverage,
          branches: branchesCoverage,
          functions: functionsCoverage,
          statements: statementsCoverage
        }
      });
    }
  });

  console.log(`\n🔴 COMPLETELY UNCOVERED FILES (${uncoveredFiles.length}):`);
  uncoveredFiles.forEach(file => {
    console.log(`   ${file.path.replace(process.cwd(), '')}`);
  });

  console.log(`\n🟡 PARTIALLY COVERED FILES (${partiallyUncoveredFiles.length}):`);
  partiallyUncoveredFiles
    .sort((a, b) => a.coverage - b.coverage)
    .forEach(file => {
      console.log(`   ${file.path.replace(process.cwd(), '')} (${file.coverage.toFixed(1)}%)`);
      console.log(`      Lines: ${file.details.lines}% | Branches: ${file.details.branches}% | Functions: ${file.details.functions}% | Statements: ${file.details.statements}%`);
    });
  
  console.log(`\n📈 PRIORITY ACTIONS:`);
  if (uncoveredFiles.length > 0) {
    console.log(`   1. Create tests for ${uncoveredFiles.length} completely uncovered files`);
  }
  if (partiallyUncoveredFiles.length > 0) {
    const lowCoverage = partiallyUncoveredFiles.filter(f => f.coverage < 70);
    console.log(`   2. Improve coverage for ${lowCoverage.length} files below 70%`);
  }
  
  console.log('\n✅ Run with --details flag for line-by-line uncovered code');
}

if (require.main === module) {
  analyzeCoverage();
}

module.exports = { analyzeCoverage };
