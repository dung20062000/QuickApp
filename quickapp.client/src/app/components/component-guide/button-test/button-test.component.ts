import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppButtonComponent } from "../../shared/rule-component/app-button/app-button.component";
import { AppIconButtonComponent } from "../../shared/rule-component/app-icon-button/app-icon-button.component";

@Component({
    selector: "app-button-test",
    templateUrl: "./button-test.component.html",
    styleUrls: ["./button-test.component.css"],
    standalone: true,
    imports: [CommonModule, AppButtonComponent, AppIconButtonComponent]
})
export class ButtonTestComponent {
    isLoading = false;

    onLoadingClick(): void {
        console.log("Loading button clicked");
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
            console.log("Loading completed");
        }, 2000);
    }

    onSubmitClick(): void {
        console.log("Submit button clicked");
    }

    onButtonClick(type: string): void {
        console.log(`${type} button clicked`);
    }

    onIconClick(iconType: string): void {
        console.log(`Icon button clicked: ${iconType}`);
    }
}
