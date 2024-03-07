'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount = {};

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  // containerMovements.textContent = ''; // both execute the same action to clean containerMovements that has already written into html (in this case)

  movements.forEach(function (movement, i) {
    const movementType = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      i + 1
    } ${movementType}</div>
        <div class="movements__value">${movement}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (movements, interestRate) {
  const sumIn = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${sumIn} €`;

  const sumOut = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)} €`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((accumulator, mov) => accumulator + mov);
  labelBalance.textContent = `${balance} €`;
  currentAccount.balance = balance;
};

const createUsernames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

console.log(accounts);

// Event handler
// let currentAccount = {}; put it on the top

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  console.log(currentAccount);
  if (currentAccount) {
    containerApp.style.opacity = 1;
    containerApp.style.transition = 'all 1s';

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clear input fields

    // inputLoginUsername.value = '';
    // inputLoginPin.value = '';
    inputLoginUsername.value = inputLoginPin.value = '';

    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount.movements, currentAccount.interestRate);
  } else {
    alert(
      '❌ You enter wrong login or password! You have two attempts, then the account will be blocked ❌'
    );
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recipient = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);
  if (
    recipient &&
    currentAccount.balance > transferAmount &&
    transferAmount > 0
  ) {
    recipient.movements.push(transferAmount);

    currentAccount.movements.push(-transferAmount);

    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount.movements, currentAccount.interestRate);

    alert('Payment made!✅');
    inputTransferTo.value = inputTransferAmount.value = '';
  } else if (currentAccount.balance) {
    alert('There is insufficient funds on the balance!❌');
  } else alert('Incorrectly entered data!');
});
