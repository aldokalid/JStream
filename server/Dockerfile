FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore ./apijstream.csproj
COPY . .
RUN dotnet publish -c Release -o out

# Runtime (ejecución del programa.)

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
EXPOSE 8080
ENTRYPOINT [ "dotnet", "apijstream.dll" ]
