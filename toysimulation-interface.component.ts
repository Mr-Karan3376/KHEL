// toysimulation-interface.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MongodbService } from '../mongodb.service';

interface PerformanceData {
  roundsCompleted: number;
  timeTaken: number;
  errorsMade: number;
}
@Component({
  selector: 'app-toysimulation-interface',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to the imports array
  templateUrl: './toysimulation-interface.component.html',
  styleUrls: ['./toysimulation-interface.component.css']
})
export class ToysimulationInterfaceComponent implements OnInit {
  memoryGameAlphabets: string[] = [];
  userSelection: string[] = [];
  isGameActive: boolean = false;
  roundsCompleted: number = 0;
  startTime!: number;
  endTime!: number;
  errorsMade: number = 0;
  performanceData: PerformanceData[] = [];
  count:number=0;
  displayedColor: string = '';
  matchItGameActive: boolean = false;
  MroundsCompleted: number = 0;
  MstartTime!: number;
  MendTime!: number;
  MerrorsMade: number = 0;


  audio: HTMLAudioElement = new Audio();
  audioPath: string = 'assets';

  constructor(private mongoDBService: MongodbService) { }

  ngOnInit() {
    this.connectToMongoDB();
  }
  async connectToMongoDB() {
    await this.mongoDBService.connect();
  }

  async loadMeditations() {
    const meditations = await this.mongoDBService.getMeditations();
    }

  async loadRhymes() {
    const rhymes = await this.mongoDBService.getRhymes();
    
  }

  async loadSongs() {
    const rhymes = await this.mongoDBService.getSongs();
    
  }
  async loadStories() {
    const rhymes = await this.mongoDBService.getStories();
    
  }
  async loadlaullaby() {
    const rhymes = await this.mongoDBService.getlaullaby();
    
  }

  ngOnDestroy() {
    this.mongoDBService.disconnect();
  }
  playAudio(fileName: string) {
    this.audio.src = `${this.audioPath}/${fileName}.mp3`;
    this.audio.load();
    this.audio.play();
  }

  startMemoryGame() {
    if (this.roundsCompleted === 8) {
      console.log('All 8 rounds completed. Generating final report.');
      this.generateReport();
      return;
    }
    this.count=4+this.roundsCompleted - this.errorsMade;
    this.memoryGameAlphabets = this.generateRandomAlphabets(this.count); // Generate a set of 4 random alphabets
    this.displayMemoryGameSequence(); // Display the sequence to the user
    this.isGameActive = true;
    this.startTime = new Date().getTime();
  }

  generateRandomAlphabets(count: number): string[] {
    const allAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const selectedAlphabets = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * allAlphabets.length);
      selectedAlphabets.push(allAlphabets[randomIndex]);
    }

    return selectedAlphabets;
  }

  displayMemoryGameSequence() {
    console.log('Memory Game Sequence:', this.memoryGameAlphabets);
  
    // Simulate visual cues (e.g., flashing buttons) using setTimeout
    this.memoryGameAlphabets.forEach((alphabet, index) => {
      setTimeout(() => {
        // Highlight the button or perform any visual cue
        console.log(`Displaying ${alphabet}`);
        // After a short delay, remove the highlight
        setTimeout(() => {
          // Reset the display or remove the visual cue
          console.log(`Removing display for ${alphabet}`);
          // If this is the last alphabet, allow the user to start selecting
          if (index === this.memoryGameAlphabets.length - 1) {
            this.userSelection = [];
          }
        }, 500); // Adjust the duration as needed
      }, index * 1000); // Adjust the delay between letters as needed
    });
  
    // After displaying the sequence, allow the user to start selecting
    setTimeout(() => {
      this.userSelection = [];
    }, this.memoryGameAlphabets.length * 1000 + 1000); // Adjust the duration as needed
  }
  

handleAlphabetSelection(alphabet: string) {
  if (!this.isGameActive) {
    return; // Ignore selections if the game is not active
  }
  this.userSelection.push(alphabet);

  if (this.userSelection.length==this.count){
    // Check if the user's selection matches the correct sequence
    if (!this.isCorrectSequence()) {
      console.log('Incorrect selection. Game Over!');
      // Implement logic to handle the end of the game, e.g., display a message, reset the game, etc.
      this.errorsMade++;
      this.endGame();
    } else if (this.userSelection.length === this.memoryGameAlphabets.length) {
      console.log('Correct sequence! Advancing to the next round.');
      // Implement logic to advance to the next round, e.g., generate a new sequence, display it, etc.
      this.roundsCompleted++;
      this.endTime = new Date().getTime();
      this.endGame();
    }
  }
}
  

  isCorrectSequence(): boolean {
    // Check if the user's selection matches the correct sequence
    for (let i = 0; i < this.userSelection.length; i++) {
      if (this.userSelection[i] !== this.memoryGameAlphabets[i]) {
        return false;
      }
    }
    if (this.userSelection.length !== this.memoryGameAlphabets.length) {
      return false;
    }
  
    return true;
  
  }

  resetGame(message: string) {
    alert(message);
    this.isGameActive = false;
    this.memoryGameAlphabets = [];
    this.userSelection = [];
    this.endTime = new Date().getTime();
  }

  startNextRound() {
    this.isGameActive = false;
    setTimeout(() => {
      this.startMemoryGame();
    }, 1000);
  }
  endGame() {
    this.resetGame(` Round completed: ${this.roundsCompleted}, Time taken: ${this.calculateTimeTaken()}s, Errors made: ${this.errorsMade}`);
    setTimeout(() => {
      this.startMemoryGame();
    }, 1000);
    if (this.roundsCompleted === 8) {
      this.generateReport();
    }
  }

  calculateTimeTaken(): number {
    return (this.endTime - this.startTime) / 1000;
  }
  generateReport() {
    const averageTime = this.calculateAverageTime();
    const totalErrors = this.calculateTotalErrors();

    console.log(`Performance Report after 8 rounds:`);
    console.log(`Average Time Taken: ${averageTime}s`);
    console.log(`Total Errors Made: ${totalErrors}`);
  }

  // Define the calculateAverageTime function
  calculateAverageTime(): number {
    const sum = this.performanceData.reduce((sum, round) => sum + round.timeTaken, 0);
    return sum / this.performanceData.length;
  }

  // Define the calculateTotalErrors function
  calculateTotalErrors(): number {
    const sum = this.performanceData.reduce((sum, round) => sum + round.errorsMade, 0);
    return sum;
  }
  
  startMatchItGame() {
    this.displayedColor = this.getRandomColor();
    console.log(this.displayedColor)
    this.matchItGameActive = true;
    this.MstartTime = new Date().getTime();
  }

  handleColorSelection(selectedColor: string) {
    if (this.matchItGameActive) {
      if (selectedColor === this.displayedColor) {
        console.log('Correct! You earned a point.');
        // Implement logic to track the score
      } else {
        console.log('Incorrect! Try again.');
        this.MerrorsMade++;
        this.endMatchItGame();
      }

      this.matchItGameActive = false;
    }
  }

  getRandomColor(): string {
    const colors = ['Orange', 'Red', 'Blue', 'Green', 'Black'];
    const randomIndex = Math.floor(Math.random() +Math.random()+ (this.MroundsCompleted + 1));
    return colors[randomIndex];
  }

  endMatchItGame() {
    this.endTime = new Date().getTime();
    this.MresetGame(`Match IT Game Over! Rounds completed: ${this.MroundsCompleted}, Time taken: ${this.McalculateTimeTaken()}s, Errors made: ${this.MerrorsMade}`);
    setTimeout(() => {
      this.startMatchItGame();
    }, 1000);
  }

  MresetGame(message: string) {
    alert(message);
    this.MroundsCompleted++;
    this.displayedColor = '';
    this.MstartTime = 0;
    this.MendTime = 0;
    this.MerrorsMade = 0;
  }

  McalculateTimeTaken(): number {
    return (this.MendTime - this.MstartTime) / 1000;
  }
}