using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StoreWebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatorUserIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CreatorUserId",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "CreatorUserId",
                table: "Comment",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CreatorUserId",
                table: "Products",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_CreatorUserId",
                table: "Comment",
                column: "CreatorUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comment_Users_CreatorUserId",
                table: "Comment",
                column: "CreatorUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Users_CreatorUserId",
                table: "Products",
                column: "CreatorUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comment_Users_CreatorUserId",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Users_CreatorUserId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_CreatorUserId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Comment_CreatorUserId",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "CreatorUserId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CreatorUserId",
                table: "Comment");
        }
    }
}
