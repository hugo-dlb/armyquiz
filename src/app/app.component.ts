import { Component } from '@angular/core';
import { Category, Choice, Database, Question } from './types';
import { v4 as uuidv4 } from 'uuid';

const arrayMove = (array: Array<any>, oldIndex: number, newIndex: number) => {
    console.log(oldIndex, " -> ", newIndex);
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
};

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
                    if (!question.uid) {
                        question.uid = uuidv4();
                    }
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
        if (confirm("Êtes-vous sûr de vouloir supprimer le choix \"" + choice.label + "\" ?")) {
            question.choices.splice(question.choices.indexOf(choice), 1);
        }
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

    deleteCategory(category: Category) {
        if (confirm("Êtes-vous sûr de vouloir supprimer la catégorie \"" + category.label + "\" ?")) {
            this.db.categories.splice(this.db.categories.indexOf(category), 1);
        }
    }

    createCategory() {
        this.db.categories.push({
            id: "",
            label: "",
            questions: []
        })
    }

    moveUp(array: Array<any>, subElement: any) {
        arrayMove(array, array.indexOf(subElement), array.indexOf(subElement) - 1);
    }

    moveDown(array: Array<any>, subElement: any) {
        arrayMove(array, array.indexOf(subElement), array.indexOf(subElement) + 1);
    }

    save() {
        for (const category of this.db.categories) {
            for (const question of category.questions) {
                let i = 0;
                const correctChoiceIndexes = [];
                for (const choice of question.choices) {
                    if (choice.isCorrectChoice) {
                        correctChoiceIndexes.push(i);
                    }
                    i++;
                }
                if (correctChoiceIndexes.length === 0) {
                    alert("La question \"" + question.label + "\" doit avoir au moins une réponse correcte renseignée.");
                    return;
                }
                question.correctChoiceIndexes = correctChoiceIndexes;
            }
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.db, undefined, 4)], { type: `text/json` }));
        a.download = "database.json";
        a.click();
    }
}
