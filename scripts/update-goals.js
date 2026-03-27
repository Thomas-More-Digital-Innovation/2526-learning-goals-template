import fs from 'fs';
import path from 'path';

const CONTENT_DIR = 'src/content';
const VERIFICATION_FILE = 'src/lib/VERIFICATION.jsonc';
const OVERVIEW_FILE = 'OVERVIEW.md';

function parseJsonc(content) {
    return JSON.parse(content.replace(/\/\/.*$/gm, ''));
}

function getGoalFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getGoalFiles(file));
        } else if (file.endsWith('goal.json')) {
            results.push(file);
        }
    });
    return results;
}

function updateGoals() {
    const goalFiles = getGoalFiles(CONTENT_DIR);
    const goals = goalFiles.map(file => {
        const content = fs.readFileSync(file, 'utf8');
        return JSON.parse(content);
    }).sort((a, b) => {
        const [aMajor, aMinor] = a.number.split('.').map(Number);
        const [bMajor, bMinor] = b.number.split('.').map(Number);
        if (aMajor !== bMajor) return aMajor - bMajor;
        return aMinor - bMinor;
    });

    // Update VERIFICATION.jsonc
    let currentVerification = {};
    if (fs.existsSync(VERIFICATION_FILE)) {
        try {
            const content = fs.readFileSync(VERIFICATION_FILE, 'utf8');
            if (content.trim()) {
                currentVerification = parseJsonc(content);
            }
        } catch (e) {
            console.error('Error parsing VERIFICATION.jsonc:', e);
        }
    }

    let verificationContent = '{\n';
    goals.forEach((goal, index) => {
        const verifiedValue = currentVerification[goal.number] || "";
        const comma = index === goals.length - 1 ? '' : ',';
        verificationContent += `    "${goal.number}": "${verifiedValue}" // ${goal.title}${comma}\n`;
    });
    verificationContent += '}';

    fs.writeFileSync(VERIFICATION_FILE, verificationContent);
    console.log(`Updated ${VERIFICATION_FILE}`);

    // Create OVERVIEW.md
    let mdContent = '# Learning Goals Overview\n\n';
    mdContent += '| Number | Learning Goal | Status | Notes |\n';
    mdContent += '|--------|---------------|--------|-------|\n';

    goals.forEach(goal => {
        const status = (currentVerification[goal.number] && currentVerification[goal.number].trim() !== "") ? 'Verified' : (goal.status || 'Todo');
        mdContent += `| ${goal.number} | ${goal.title} | ${status} | |\n`;
    });

    fs.writeFileSync(OVERVIEW_FILE, mdContent);
    console.log(`Created ${OVERVIEW_FILE}`);
}

updateGoals();
