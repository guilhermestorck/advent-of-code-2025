import * as fs from "fs";
import * as readline from "readline";

function firstPuzzle(ranges: [string, string][]): number {
    return ranges.flatMap((range) => getInvalidIds(range, 2)).reduce((a, b) => a + b);
}

function secondPuzzle(ranges: [string, string][]): number {
    return ranges.flatMap((range) => {
        const invalidIds: number[][] = [];
        for (let size = 2; size <= range[1].length; size++) {
            invalidIds.push(getInvalidIds(range, size));
        }
        return Array.from(new Set(invalidIds.flat()).values()); //deduping
    }).flat().reduce((a, b) => a + b);
}

function getInvalidIds([min, max]: [string, string], size: number): number[] {
    const maxN = parseInt(max);
    const minN = parseInt(min);

    let seed = min.length % size === 0
        ? parseInt(min.substring(0, min.length / size))
        : Math.pow(10, Math.floor(min.length / size));

    while (generateNumberFromSeed(seed, size) < minN) seed++;

    const invalidIds: number[] = [];
    let nextInvalid = generateNumberFromSeed(seed, size);
    while (nextInvalid <= maxN) {
        invalidIds.push(nextInvalid);
        seed++;
        nextInvalid = generateNumberFromSeed(seed, size);
    }
    return invalidIds;
}

function generateNumberFromSeed(seed: number, size: number): number {
    return parseInt(new Array(size).fill(seed).join(''));
}

async function loadRanges(fileName: string): Promise<[string, string][]> {
    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines: string[] = [];
    for await (const line of rl) {
        lines.push(line);
    }

    return lines.flatMap(line => line.split(',').map((range): [string, string] => {
        const parts = range.split('-');
        return [parts[0], parts[1]];
    }));
}

async function run() {
    const rangesInput = await loadRanges('day-02.input.txt');
    const rangesExample = await loadRanges('day-02.example.txt');
    console.log('>> INPUT', firstPuzzle(rangesInput));
    console.log('>> EXAMPLE', firstPuzzle(rangesExample));
    console.log('-----------')
    console.log('>> INPUT', secondPuzzle(rangesInput));
    console.log('>> EXAMPLE', secondPuzzle(rangesExample));
}

run();