import sys
import random
import matplotlib.pyplot as plt
from PyQt5.QtWidgets import (
    QApplication, QWidget, QLabel, QPushButton, QVBoxLayout, QTabWidget, QSpinBox,
    QMessageBox, QGroupBox, QGridLayout, QDoubleSpinBox, QHBoxLayout, QDialog,
    QInputDialog, QFormLayout
)
from PyQt5.QtGui import QIcon
from PyQt5.QtCore import Qt

class HomeTab(QWidget):     # homepage
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        self.setWindowIcon(QIcon("MoneyLogo.jpg"))

        intro = QLabel("""
        <div style="
            text-align: center;
            color: #00072D;
            font-family: Georgia;
        ">
            <h1 style="margin-bottom: 25px;">Money Mentor Labs: Finance, Felt</h1>
            <p style="font-style: italic; font-size: 24px;">Balance. Discipline. Growth</p>
        </div>
        """)
        intro.setAlignment(Qt.AlignCenter)
        intro.setWordWrap(True)

        container = QWidget()
        container_layout = QVBoxLayout()
        container_layout.addWidget(intro)
        container.setLayout(container_layout)
        container.setStyleSheet("""
            QWidget {
                border: 4px double #00072D;
                border-radius: 10px;
                padding: 20px;
                background-color: #f1f1fb;
                font-family: Georgia;
            }
        """)

        layout.addStretch()
        layout.addWidget(container)
        layout.addStretch()

        self.setLayout(layout)
        self.setStyleSheet("background-color: #f1f1fb; font-family: Georgia;")


diffscenarios = [
    {"title": "Car Repair", "message": "Your car needs repair. -£300", "impact": -300},
    {"title": "Bonus", "message": "You earned a bonus! +£250", "impact": +250},
    {"title": "Rent Increase", "message": "Rent increased this month. -£100", "impact": -100},
    {"title": "Gift Received", "message": "It was your Birthday this month! +£150", "impact": +150},
    {"title": "Medical Bill", "message": "Unexpected medical bill. -£400", "impact": -400},
    {"title": "Phone Repairing", "message": "Your phone broke and needs repairing. -£200", "impact": -200},
    {"title": "Congrats!", "message": "Congrats, you landed yourself a date! Unfortunately it costed money. -£50", "impact": -50},
    {"title": "Dropped Coin", "message": "You Picked up £1 coin +£1", "impact": +1},
    {"title": "Lost Wallet", "message": "You lost your wallet and some cash. -£60", "impact": -60},
    {"title": "Bike Stolen", "message": "Your bike got stolen. -£150", "impact": -150},
    {"title": "Refund", "message": "You received a refund from an online order. +£45", "impact": +45},
    {"title": "Parking Fine", "message": "You forgot to pay for parking. -£70", "impact": -70},
    {"title": "Tax Refund", "message": "You received a tax refund. +£300", "impact": +300},
    {"title": "Charity", "message": "You donated to a local charity. -£25", "impact": -25},
    {"title": "Tutor Income", "message": "You earned from tutoring. +£90", "impact": +90},
    {"title": "Flatmate Moved Out", "message": "Your flatmate moved out and rent is now higher. -£200", "impact": -200},
    {"title": "Sold Item", "message": "You sold an old item online. +£50", "impact": +50},
    {"title": "Library Fine", "message": "You forgot to return a book. -£10", "impact": -10},
    {"title": "Unexpected Bonus", "message": "Your manager gave you a surprise bonus. +£400", "impact": +400},
    {"title": "Appliance Repair", "message": "Washing machine broke down. -£220", "impact": -220},
    {"title": "Won a Prize", "message": "You won a small prize in a raffle. +£75", "impact": +75},
    {"title": "Visiting Family", "message": "You drove to family. Extra fuel. -£90", "impact": -90},
    {"title": "Pet Emergency", "message": "Your pet had an unexpected vet visit. -£130", "impact": -130},
    {"title": "Side Hustle", "message": "You made extra cash from a weekend hustle. +£160", "impact": +160},
    {"title": "Train Delay Refund", "message": "You got compensation for a delayed train. +£20", "impact": +20},
    {"title": "Surprise Treat", "message": "You treated yourself to a fancy dinner. -£60", "impact": -60},
    {"title": "Interest Gained", "message": "Your savings earned some interest. +£35", "impact": +35},
    {"title": "Subscription Renewal", "message": "Annual subscription auto-renewed. -£85", "impact": -85},
    {"title": "Lost AirPods", "message": "You lost your AirPods and had to replace them. -£140", "impact": -140},
    {"title": "Cashback", "message": "You received cashback from your credit card. +£25", "impact": +25}
]


class BudgetTab(QWidget):   # sim1
    def __init__(self):
        super().__init__()
        self.scenario_adjuster = 0
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        layout.setContentsMargins(10, 10, 10, 10)
        layout.setSpacing(12)

        title = QLabel("Budget Calculator")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 25px; font-weight: bold;")

        self.rem_label = QLabel("Remaining Budget: £2000")
        self.rem_label.setAlignment(Qt.AlignCenter)
        self.rem_label.setStyleSheet("font-size: 18px; font-weight: bold;")

        self.budget_inp = QSpinBox()
        self.budget_inp.setRange(0, 20000)
        self.budget_inp.setValue(2200)
        self.budget_inp.valueChanged.connect(self.update_rem_budget)

        self.costs_inputs = {}
        self.costs_cats = ["Entertainment", "Debt", "Savings", "Rent", "Transport", "Food"]
        costs_layout = QGridLayout()
        for i, category in enumerate(self.costs_cats):
            label = QLabel(f"{category} (£):")
            spin = QSpinBox()
            spin.setRange(0, 20000)
            spin.valueChanged.connect(self.update_rem_budget)
            self.costs_inputs[category] = spin
            costs_layout.addWidget(label, i, 0)
            costs_layout.addWidget(spin, i, 1)

        savings_group = QGroupBox("Savings Setup")
        savings_layout = QGridLayout()
        self.initial_saving = QSpinBox()
        self.initial_saving.setMaximum(1000000)
        self.initial_saving.setValue(1000)
        self.savings_rate = QDoubleSpinBox()
        self.savings_rate.setMaximum(100.0)
        self.savings_rate.setValue(4.0)
        savings_layout.addWidget(QLabel("Initial Savings (£):"), 0, 0)
        savings_layout.addWidget(self.initial_saving, 0, 1)
        savings_layout.addWidget(QLabel("Savings Interest Rate (%):"), 1, 0)
        savings_layout.addWidget(self.savings_rate, 1, 1)
        savings_group.setLayout(savings_layout)

        debt_group = QGroupBox("Debt Setup")
        debt_layout = QGridLayout()
        self.intial_debt = QSpinBox()
        self.intial_debt.setMaximum(1000000)
        self.intial_debt.setValue(10000)
        self.debt_rate = QDoubleSpinBox()
        self.debt_rate.setMaximum(100.0)
        self.debt_rate.setValue(5.0)
        debt_layout.addWidget(QLabel("Total Debt (£):"), 0, 0)
        debt_layout.addWidget(self.intial_debt, 0, 1)
        debt_layout.addWidget(QLabel("Debt Interest Rate (%):"), 1, 0)
        debt_layout.addWidget(self.debt_rate, 1, 1)
        debt_group.setLayout(debt_layout)

        sumary_btn = QPushButton("▶ Simulate Month")
        sumary_btn.clicked.connect(self.sim_budget)

        layout.addWidget(title)
        layout.addWidget(self.rem_label)
        layout.addWidget(QLabel("Total Monthly Budget (£):"))
        layout.addWidget(self.budget_inp)
        layout.addLayout(costs_layout)
        layout.addWidget(savings_group)
        layout.addWidget(debt_group)
        layout.addWidget(sumary_btn)

        self.setLayout(layout)

        # Style with rounded corners and soft background
        self.setStyleSheet("""
            QWidget {
                background-color: #f1f1fb;
                font-family: Georgia;
            }
            QLabel {
                background-color: #f1f1fb;
            }
            QGroupBox {
                background-color: #f1f1fb;
                border: 2px solid #ccccff;
                border-radius: 12px;
                margin-top: 10px;
                padding: 8px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 14px;
                padding: 2px 6px;
                font-weight: bold;
            }
            QSpinBox, QDoubleSpinBox {
                background-color: white;
                border: 1px solid #aaa;
                border-radius: 8px;
                padding: 3px 6px;
                font-family: Georgia;
            }
            QPushButton {
                background-color: #dcdcff;
                border: 1px solid #8888cc;
                border-radius: 12px;
                padding: 8px 14px;
                font-family: Georgia;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #c8c8f0;
            }
        """)

    def update_rem_budget(self):
        total_allocated = sum(spin.value() for spin in self.costs_inputs.values())
        rem = self.budget_inp.value() - total_allocated + self.scenario_adjuster
        self.rem_label.setText(f"Remaining Budget: £{rem}")

    def sim_budget(self):
        plt.close('all')  # closes previous graphs
        total_allocated = sum(spin.value() for spin in self.costs_inputs.values())
        base_budget = self.budget_inp.value()

        selected_scenarios = random.sample(diffscenarios, 3)  # selects three random common events from diffscenarios
        total_impact = sum(sc['impact'] for sc in selected_scenarios)       # calculates the money gained and lost from scenarios

        scenario_text = "\n\n".join([f"{sc['title']}: {sc['message']}" for sc in selected_scenarios])
        QMessageBox.information(self, "Life Events This Month", scenario_text)
        rem = base_budget - total_allocated + total_impact
        summary_box = QMessageBox(self)
        summary_box.setWindowTitle("Budget Outcome")
        if rem < 0:
            summary_box.setText(f"<b>You overspent this month by: <span style='color:red;'>-£{-rem}</span></b>")    # if overbudget, appear red
            summary_box.setIcon(QMessageBox.Critical)
        else:
            summary_box.setText(f"<b>Budget remaining: <span style='color:green;'>+£{rem}</span></b>")      # if under budget appear green
            summary_box.setIcon(QMessageBox.Information)
        summary_box.exec_()

        monthly_savings = self.costs_inputs["Savings"].value()
        savings = self.initial_saving.value()
        savings_rate = self.savings_rate.value() / 100 / 12
        savings_balances = []
        for _ in range(361):
            savings_balances.append(savings)
            savings = savings * (1 + savings_rate) + monthly_savings
        final_savings = savings_balances[-1]

        balance = self.intial_debt.value()
        debt_rate = self.debt_rate.value() / 100 / 12
        monthly_repay = self.costs_inputs["Debt"].value()
        debt_balances = []
        month = 0
        while balance > 0 and month < 600:
            balance += balance * debt_rate - monthly_repay
            balance = max(balance, 0)
            debt_balances.append(balance)
            month += 1

        plt.figure()        # line graph for projected savings and debt
        plt.plot(range(361), savings_balances, label="Savings (30 yrs)")
        plt.plot(range(len(debt_balances)), debt_balances, label="Debt")
        plt.xlabel("Months")
        plt.ylabel("Amount (£)")
        plt.title("Long-Term Financial Outlook")
        plt.grid(True)
        plt.legend()
        plt.show()


        QMessageBox.information(self, "Month Summary",
                                f"In 30 years, you will have ~£{final_savings:,.2f} in savings.\n"
                                f"Debt-free in approx. {month} months (~{month // 12} yrs & {month % 12} mo).")

class FinanceGameTab(QWidget):  # sim2
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Financial Life Simulation")
        self.setGeometry(100, 100, 600, 400)
        self.setStyleSheet("background-color: #f1f1fb; font-family: Georgia;")
        self.reset_game()
        self.start_screen()

    def reset_game(self):
        plt.close('all')
        self.total_cost = 0
        self.essentials_cost = 0
        self.luxury_cost = 0
        self.savings= 0
        self.happiness = 50
        self.breakfast_days = 30
        self.coffee_days = 30
        self.lunch_days = 30
        self.dinner_days = 30

    def start_screen(self):
        layout = QVBoxLayout()
        welcome = QLabel("Budget a Month as a 21 Year Old")
        welcome.setAlignment(Qt.AlignCenter)
        welcome.setStyleSheet("font-family: Georgia; font-size: 24px; font-weight: bold;")

        tip = QLabel(random.choice([
            "Top tip: Follow the 50/30/20 rule to balance needs, wants, and savings.",
            "Top tip: Cook at home - it’s cheaper and healthier.",
            "Smart move: Track every expense - small ones add up fast!",
            "Remember: Credit is not free money - use it wisely!",
            "Reminder: Save spare change - it adds up faster than you think."
        ]))
        tip.setAlignment(Qt.AlignCenter)
        tip.setStyleSheet("font-style: italic; color: #555; font-family: Georgia;")

        start_button = QPushButton("▶ Start Game")
        start_button.clicked.connect(self.init_month)
        start_button.setStyleSheet("font-family: Georgia;")

        layout.addWidget(welcome)
        layout.addWidget(tip)
        layout.addWidget(start_button)
        self.setLayout(layout)

        self.setStyleSheet("""
            QWidget {
                background-color: #f1f1fb;
                font-family: Georgia;
            }
            QLabel {
                background-color: #f1f1fb;
            }
            QPushButton {
                background-color: #dcdcff;
                border: 1px solid #8888cc;
                border-radius: 12px;
                padding: 8px 14px;
                font-family: Georgia;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #c8c8f0;
            }
        """)

    def init_month(self):
        self.reset_game()

        housing, _ = QInputDialog.getItem(self, "Housing Choice", "Choose your housing:",
                                          ["40m² flat (£800)", "60m² furnished flat (£1200)", "80m² luxury flat (£1500)"])
        rent_cost = int(housing.split("(£")[1].replace(")", ""))
        self.total_cost += rent_cost
        self.essentials_cost += 800
        self.luxury_cost += rent_cost - 800
        self.happiness += (rent_cost - 800) // 20

        gym, _ = QInputDialog.getItem(self, "Gym Membership", "Do you want a gym membership?", ["Yes (£30)", "No"])
        if gym.startswith("Yes"):
            self.total_cost += 30
            self.luxury_cost += 30
            self.happiness += 5

        netflix, _ = QInputDialog.getItem(self, "Netflix Subscription", "Do you want Netflix?", ["Yes (£10)", "No"])
        if netflix.startswith("Yes"):
            self.total_cost += 10
            self.luxury_cost += 10
            self.happiness += 3

        outings, _ = QInputDialog.getInt(self, "Going Out", "How many outings this month? (£30 each)", 0, 0, 20)
        self.total_cost += outings * 30
        self.luxury_cost += outings * 30
        self.happiness += outings * 3

        savings_input, _ = QInputDialog.getInt(self, "Savings", "How much to save this month?", 0, 0, 10000)
        self.total_cost += savings_input
        self.savings = savings_input

        self.meal_page("Breakfast", [("Cereal (£2)", 2), ("Smoothie (£4)", 4), ("Cafe (£10)", 10)], self.coffee_page, self.breakfast_days)

    def coffee_page(self):
        self.meal_page("Coffee", [("Instant (£1)", 1), ("Iced Coffee (£5)", 5)], self.lunch_page, self.coffee_days)

    def lunch_page(self):
        self.meal_page("Lunch", [("Packed Lunch (£3)", 3), ("Panini (£5)", 5), ("Restaurant (£15)", 15)], self.dinner_page, self.lunch_days)

    def dinner_page(self):
        self.meal_page("Dinner", [("Home Cooked (£3)", 3), ("Takeout (£7)", 7), ("Restaurant (£12)", 12)], self.end_game, self.dinner_days)

    def meal_page(self, meal, options, next_meal, days):
        dialog = QDialog(self)
        dialog.setWindowTitle(f"{meal} Choices - {days} Days Available")
        dialog.setStyleSheet("background-color: #f1f1fb; font-family: Georgia;")

        layout = QVBoxLayout()
        form_layout = QFormLayout()
        spinners = []

        days_left_label = QLabel(f"Days Left: {days}")
        days_left_label.setStyleSheet("font-size: 16px; font-weight: bold; font-family: Georgia;")
        layout.addWidget(days_left_label)

        def update_days_left():
            total = sum(sp.value() for sp in spinners)
            remaining = days - total
            days_left_label.setText(f"Days Left: {remaining}")
            if remaining < 0:
                days_left_label.setStyleSheet("color: red; font-weight: bold; font-family: Georgia;")
            else:
                days_left_label.setStyleSheet("color: black; font-weight: bold; font-family: Georgia;")

        for desc, _ in options:
            spin = QSpinBox()
            spin.setRange(0, days)
            spin.valueChanged.connect(update_days_left)
            label = QLabel(desc)
            label.setStyleSheet("font-family: Georgia;")
            form_layout.addRow(label, spin)
            spinners.append(spin)

        layout.addLayout(form_layout)

        confirm = QPushButton("Confirm")
        confirm.setStyleSheet("font-family: Georgia;")

        def submit_meal():
            total = sum(sp.value() for sp in spinners)
            if total > days:
                QMessageBox.warning(dialog, "Error", f"You only have {days} days for {meal}!")
                return
            for i, sp in enumerate(spinners):
                count = sp.value()
                self.total_cost += count * options[i][1]
                if "Home" in options[i][0] or "Instant" in options[i][0] or "Packed" in options[i][0]:
                    self.essentials_cost += count * options[i][1]
                else:
                    self.luxury_cost += count * options[i][1]
                    self.happiness += count
            dialog.accept()
            next_meal()

        confirm.clicked.connect(submit_meal)
        layout.addWidget(confirm)
        dialog.setLayout(layout)
        dialog.exec_()


    def end_game(self):
        av_sal = 2200
        financial_health = max(0, 100 - ((self.total_cost - sal) * 100 / av_sal)) if self.total_cost > av_sal else 100
        happiness = min(100, self.happiness)

        plt.close('all')        # close all existing graphs before creating new one.
        plt.figure(figsize=(6, 6))
        plt.pie([self.essentials_cost, self.luxury_cost, self.savings],
                labels=["Essentials", "Luxuries", "Savings"], autopct="%1.1f%%")
        plt.title("Where Your Money Went")
        plt.show()

        rate, _ = QInputDialog.getDouble(self, "Interest Rate", "Annual interest rate (%):", 4.0, 0, 100, 2)
        balance = self.savings
        contrib = self.savings
        growth = []
        for _ in range(41):
            growth.append(balance)
            balance *= (1 + rate / 100)
            contrib *= 1.06
            balance += contrib

        plt.figure()
        plt.plot(range(41), growth)
        plt.title("Projected Savings in 40 Years")
        plt.xlabel("Years")
        plt.ylabel("Total Savings (£)")
        plt.grid(True)
        plt.show()

        QMessageBox.information(self, "End of Game",
                                f"Average Monthly Salary of 21 Year Old: £{av_sal}\nTotal Spending: £{self.total_cost}\n"
                                f"Realistic Lifestyle? {'YES' if self.total_cost <= av_sal else 'NO'}\n"
                                f"Financial Health Score: {financial_health:.1f}/100\n"
                                f"Happiness Score: {happiness:.1f}/100\n"
                                f"Projected Savings in 40 years: £{balance:,.2f}\n\n"
                                f"Remember: Financial health is vital, but we only live once! Make every moment count."
                                f" Happiness today matters too.")



if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = QWidget()
    layout = QVBoxLayout()
    tabs = QTabWidget()
    tabs.addTab(HomeTab(), "Home")
    tabs.addTab(BudgetTab(), "Monthly Budget Simulator")
    tabs.addTab(FinanceGameTab(), "Financial Life Simulation")
    layout.addWidget(tabs)
    window.setLayout(layout)
    window.setWindowTitle("Money Mentor - Financial Literacy for Young Adults")
    window.resize(900, 700)
    window.show()
    sys.exit(app.exec_())