using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BuggyController : ControllerBase
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("Not a good request");
    }

    [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("This is a text exception");
    }

    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDto product)
    {
        return Ok();
    }
}
