import { Component, OnInit } from '@angular/core';
import { Category, Choice, Database, Question } from './types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    db: Database = { categories: [] };
    loaded = false


    onFileChange(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const database: Database = JSON.parse(e.target?.result as string);
            for (const category of database.categories) {
                for (const question of category.questions) {
                    let i = 0;
                    for (const choice of question.choices) {
                        choice.isCorrectChoice = question.correctChoiceIndexes.includes(i);
                        i++;
                    }
                }
            }
            this.db = database;
            this.loaded = true;
        }
        reader.readAsText(file);
    }

    createChoice(question: Question) {
        question.choices.push({
            label: "",
            isCorrectChoice: false
        })
    }

    deleteChoice(question: Question, choice: Choice) {
        question.choices.splice(question.choices.indexOf(choice), 1);
    }

    createQuestion(category: Category) {
        category.questions.push({
            label: "",
            choices: [],
            correctChoiceIndexes: []
        })
    }

    deleteQuestion(category: Category, question: Question) {
        if (confirm("Êtes-vous sûr de vouloir supprimer la question \"" + question.label + "\" ?")) {
            category.questions.splice(category.questions.indexOf(question), 1);
        }
    }

    save() {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.db, undefined, 4)], { type: `text/json` }));
        a.download = "database.json";
        a.click();
    }
}
