import * as fs from 'fs';
import * as readline from 'readline';

function whatsThePassword(instructions: string[]): number {
    let pwd = 0;
    let position = 50;

    for(let instruction of instructions) {
        const direction = instruction[0];
        let amount = parseInt(instruction.slice(1));
        if(direction === 'L') {
            amount *= -1;
        }

        let new_position = position + amount;
        new_position = new_position % 100;
        if(new_position < 0) {
            new_position += 100;
        }
        // console.log(`[${instruction}]  ${position} -> ${new_position} (${position + amount})`);

        if(new_position === 0) pwd++;

        position = new_position;
    }
    return pwd;
}

function whatsThePassword2(instructions: string[]): number {
    let pwd = 0;
    let position = 50;

    for(let instruction of instructions) {
        const direction = instruction[0];
        let amount = parseInt(instruction.slice(1));
        if(direction === 'L') {
            amount *= -1;
        }

        let new_position = position + amount;
        if(new_position < 0) {
            pwd += Math.floor(-new_position / 100) + 1;
            if(position === 0) pwd--;
        } else if(new_position === 0) {
            pwd++;
        } else {
            pwd += Math.floor(new_position / 100);
        }

        new_position = new_position % 100;
        if(new_position < 0) {
            new_position += 100;
        }
        // console.log(`[${instruction}]  ${position} -> ${new_position} (${position + amount}) (${pwd})`);

        position = new_position;
    }
    return pwd;
}

async function loadInstructions(fileName: string): Promise<string[]> {
    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const instructions: string[] = [];
    for await (const line of rl) {
        instructions.push(line);
    }
    return instructions;
}

async function run() {
    const instructions = await loadInstructions('day-01.input.txt');
    console.log(whatsThePassword(instructions));
    console.log(whatsThePassword2(instructions));
}

run();