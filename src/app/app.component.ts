import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from './users.model';
import { UsersService } from './users.service';
import { NgForm } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('userForm') userForm: NgForm;
  @ViewChild('deleteForm') deleteForm: NgForm;
  title = 'CRUD_APP';

  loadedUsers: Users[] = [];
  editMode: boolean = false;
  constructor(private http: HttpClient, private usersService: UsersService) {}
  addUserFlag: boolean = false;
  deleteUserFlag: boolean = false;

  ngOnInit(): void {
    this.onFetchUsers();
  }

  onDeleteUserForm() {
    this.deleteUserFlag = true;
  }

  onAddUserForm() {
    this.addUserFlag = true;
  }

  onAddUser(newUser: Users) {
    this.usersService
      .addUser(newUser.id, newUser.title, newUser.body)
      .subscribe((responseData) => {
        console.log(responseData);
      });
    this.userForm.reset();
  }

  onFetchUsers() {
    this.usersService.fetchUsers().subscribe((users) => {
      this.loadedUsers = users;
    });
    console.log(this.loadedUsers);
  }

  onUpdateUser(newUser: Users) {
    this.usersService
      .updateUsers(newUser.id, newUser.title, newUser.body)
      .subscribe((responseData) => {
        console.log(responseData);
        const updatedUsers = [...this.loadedUsers];
        const oldUserIndex = updatedUsers.findIndex((u) => u.id === newUser.id);
        updatedUsers[oldUserIndex] = newUser;
        this.loadedUsers = updatedUsers;
      });
    this.userForm.reset();
  }

  onDeleteUser(deletedUser: Users) {
    const updatedUsers = [...this.loadedUsers];
    updatedUsers.forEach((value, index) => {
      if (value.id == deletedUser.id) {
        updatedUsers.splice(index, 1);
        console.log('Deleted user with id :', deletedUser.id);
        this.loadedUsers = updatedUsers;
      } else {
        console.log('User not found');
      }
    });
    this.deleteForm.reset();
  }

  onDeleteAllUsers() {
    this.usersService.deleteUsers().subscribe((responseData) => {
      console.log('All users deleted successfully');
    });
  }

  onCancel() {
    this.addUserFlag = false;
    this.deleteUserFlag = false;
    this.editMode = false;
  }
}
