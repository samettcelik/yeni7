# 🔧 BUILD aşaması (.NET 9.0 SDK)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# .csproj dosyasını kopyala ve restore et
COPY *.csproj ./
RUN dotnet restore

# Tüm dosyaları kopyala ve publish et
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# 🚀 RUNTIME aşaması (.NET 9.0 ASP.NET)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render 80 portunu dinler
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "DUGUNMETE.dll"]
